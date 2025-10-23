import { useState, useEffect } from 'react';
import supabase from '../services/supabase';
import useAuth from './useAuth';
import { checkProfileComplete } from '../utils/profileCompletion';

/**
 * Custom hook for managing member profiles
 * 
 * Provides functionality to:
 * - Fetch the current user's profile
 * - Update the profile
 * - Fetch home groups for selection
 * - Handle loading and error states
 */
const useMemberProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [homeGroups, setHomeGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the user's profile on component mount or when user changes
    useEffect(() => {
        if (user) {
            fetchProfile();
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [user]);

    // Subscribe to real-time changes to the profile
    useEffect(() => {
        if (!user) return;

        let subscription;

        const setupSubscription = async () => {
            subscription = supabase
                .channel(`member_profiles_changes_${user.id}`)
                .on('postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'member_profiles',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        console.log('Profile subscription triggered:', payload);
                        // Force update profile immediately
                        if (payload.new) {
                            setProfile(payload.new);
                            // Then refresh to get related home_group data
                            fetchProfile();
                        }
                    }
                )
                .subscribe((status) => {
                    console.log('Subscription status:', status);
                });
        };

        setupSubscription();

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [user]);

    /**
     * Fetch the current user's profile
     */
    const fetchProfile = async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);

            // First, check if profile exists
            const { data: profileData, error: profileError } = await supabase
                .from('member_profiles')
                .select(`
          *,
          home_group:home_groups(*)
        `)
                .eq('user_id', user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
                throw profileError;
            }

            if (profileData) {
                setProfile(profileData);
            } else {
                // Profile doesn't exist yet, create an empty one
                setProfile({
                    user_id: user.id,
                    first_name: '',
                    middle_initial: '',
                    last_name: '',
                    email: user.email,
                    phone: '',
                    clean_date: null,
                    home_group_id: null,
                    listed_in_directory: false,
                    willing_to_sponsor: false,
                    share_phone_in_directory: false,
                    share_email_in_directory: false,
                    officer_position: null
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update the user's profile
     */
    const updateProfile = async (profileData) => {
        if (!user) return { success: false, error: 'User not authenticated' };

        try {
            setLoading(true);
            setError(null);

            // Check if profile exists
            const { data: existingProfile, error: checkError } = await supabase
                .from('member_profiles')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();

            if (checkError) {
                throw checkError;
            }

            let result;

            if (existingProfile) {
                // Update existing profile with all fields
                const updateData = {
                    first_name: profileData.first_name,
                    middle_initial: profileData.middle_initial || null,
                    last_name: profileData.last_name,
                    phone: profileData.phone,
                    email: profileData.email,
                    clean_date: profileData.clean_date || null,
                    home_group_id: profileData.home_group_id || null,
                    listed_in_directory: profileData.listed_in_directory,
                    willing_to_sponsor: profileData.willing_to_sponsor,
                    share_phone_in_directory: profileData.share_phone_in_directory || false,
                    share_email_in_directory: profileData.share_email_in_directory || false,
                    officer_position: profileData.officer_position || null,
                    updated_at: new Date().toISOString()
                };

                // Calculate and set profile_complete status
                updateData.profile_complete = checkProfileComplete(updateData);

                console.log('Updating profile with data:', updateData);

                result = await supabase
                    .from('member_profiles')
                    .update(updateData)
                    .eq('user_id', user.id);
            } else {
                // Create new profile with all fields
                const insertData = {
                    user_id: user.id,
                    first_name: profileData.first_name,
                    middle_initial: profileData.middle_initial || null,
                    last_name: profileData.last_name,
                    phone: profileData.phone,
                    email: profileData.email,
                    clean_date: profileData.clean_date || null,
                    home_group_id: profileData.home_group_id || null,
                    listed_in_directory: profileData.listed_in_directory,
                    willing_to_sponsor: profileData.willing_to_sponsor,
                    share_phone_in_directory: profileData.share_phone_in_directory || false,
                    share_email_in_directory: profileData.share_email_in_directory || false,
                    officer_position: profileData.officer_position || null
                };

                // Calculate and set profile_complete status
                insertData.profile_complete = checkProfileComplete(insertData);

                console.log('Creating new profile with data:', insertData);

                result = await supabase
                    .from('member_profiles')
                    .insert(insertData);
            }

            if (result.error) {
                throw result.error;
            }

            // Fetch the updated profile and wait for it to complete
            await fetchProfile();

            // Add a small delay to ensure state has updated before returning
            await new Promise(resolve => setTimeout(resolve, 100));

            return { success: true };
        } catch (err) {
            console.error('Error updating profile:', err);
            console.error('Detailed error:', JSON.stringify(err, null, 2));
            if (err.details) {
                console.error('Error details:', err.details);
            }
            if (err.hint) {
                console.error('Error hint:', err.hint);
            }
            setError('Failed to update profile. Please try again later.');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch all home groups for selection
     * Groups are sorted by start_time
     */
    const fetchHomeGroups = async () => {
        try {
            const { data, error } = await supabase
                .from('home_groups')
                .select('*')
                .order('start_time', { ascending: true });

            if (error) {
                throw error;
            }

            // Sort by start time
            const sortedData = (data || []).sort((a, b) => {
                const timeA = a.start_time || '';
                const timeB = b.start_time || '';
                return timeA.localeCompare(timeB);
            });

            setHomeGroups(sortedData);
        } catch (err) {
            console.error('Error fetching home groups:', err);
            setError('Failed to load home groups. Please try again later.');
        }
    };

    return {
        profile,
        homeGroups,
        loading,
        error,
        fetchProfile,
        updateProfile,
        fetchHomeGroups
    };
};

export default useMemberProfile;