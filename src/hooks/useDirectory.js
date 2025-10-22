import { useState, useEffect } from 'react';
import supabase from '../services/supabase';
import { getNameSortKey, formatMemberName } from '../utils/nameUtils';

const useDirectory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [homeGroups, setHomeGroups] = useState([]);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHomeGroup, setSelectedHomeGroup] = useState('');
    const [showSponsorsOnly, setShowSponsorsOnly] = useState(false);
    const [sortBy, setSortBy] = useState('name'); // 'name', 'clean_date', 'joined_date'

    // Fetch approved members who opted into directory
    const fetchDirectoryMembers = async () => {
        setLoading(true);
        setError(null);

        try {
            // First, get all profiles that are listed in directory
            const { data: profiles, error: profileError } = await supabase
                .from('member_profiles')
                .select('*')
                .eq('listed_in_directory', true)
                .order('last_name', { ascending: true, nullsLast: true })
                .order('first_name', { ascending: true, nullsLast: true });

            if (profileError) {
                throw profileError;
            }

            if (!profiles || profiles.length === 0) {
                setMembers([]);
                setFilteredMembers([]);
                return { success: true, members: [] };
            }

            // Get user IDs from profiles
            const userIds = profiles.map(p => p.user_id);

            // Fetch user_roles for these users to check approval status
            const { data: userRoles, error: rolesError } = await supabase
                .from('user_roles')
                .select('user_id, approval_status, created_at')
                .in('user_id', userIds);

            if (rolesError) {
                throw rolesError;
            }

            // Fetch home groups
            const { data: homeGroupsData, error: homeGroupError } = await supabase
                .from('home_groups')
                .select('*');

            if (homeGroupError) {
                throw homeGroupError;
            }

            // Create a map of user_id -> user_role for quick lookup
            const rolesMap = {};
            (userRoles || []).forEach(role => {
                rolesMap[role.user_id] = role;
            });

            // Create a map of home_group_id -> home_group for quick lookup
            const homeGroupsMap = {};
            (homeGroupsData || []).forEach(group => {
                homeGroupsMap[group.id] = group;
            });

            // Combine profiles with their roles and home groups
            const enrichedMembers = profiles.map(profile => ({
                ...profile,
                user_role: rolesMap[profile.user_id] || null,
                home_group: profile.home_group_id ? homeGroupsMap[profile.home_group_id] : null
            }));

            // Filter to only approved members
            const approvedMembers = enrichedMembers.filter(member =>
                member.user_role?.approval_status === 'approved' &&
                (member.first_name || member.last_name)
            );

            setMembers(approvedMembers);
            setFilteredMembers(approvedMembers);
            return { success: true, members: approvedMembers };

        } catch (err) {
            console.error('Error fetching directory members:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Fetch home groups for filter dropdown, sorted by day of week
    const fetchHomeGroups = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('home_groups')
                .select('id, name, start_time, day_of_week')
                .order('day_of_week', { ascending: true, nullsFirst: false })
                .order('start_time', { ascending: true });

            if (fetchError) {
                throw fetchError;
            }

            // Ensure proper sorting with fallback for missing day_of_week
            const sortedData = (data || []).sort((a, b) => {
                const dayA = a.day_of_week !== null && a.day_of_week !== undefined ? a.day_of_week : 0;
                const dayB = b.day_of_week !== null && b.day_of_week !== undefined ? b.day_of_week : 0;

                if (dayA !== dayB) {
                    return dayA - dayB;
                }

                // Secondary sort by time
                const timeA = a.start_time || '';
                const timeB = b.start_time || '';
                return timeA.localeCompare(timeB);
            });

            setHomeGroups(sortedData);
        } catch (err) {
            console.error('Error fetching home groups:', err);
            setHomeGroups([]);
        }
    };

    // Apply filters and search
    useEffect(() => {
        let filtered = [...members];

        // Apply search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(member => {
                const nameMatch = member.first_name?.toLowerCase().includes(query) ||
                    member.last_name?.toLowerCase().includes(query) ||
                    formatMemberName(member).toLowerCase().includes(query);
                const homeGroupMatch = member.home_group?.name?.toLowerCase().includes(query);
                return nameMatch || homeGroupMatch;
            });
        }

        // Apply home group filter
        if (selectedHomeGroup) {
            filtered = filtered.filter(member =>
                member.home_group_id === parseInt(selectedHomeGroup)
            );
        }

        // Apply sponsor filter
        if (showSponsorsOnly) {
            filtered = filtered.filter(member => member.willing_to_sponsor === true);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return getNameSortKey(a).localeCompare(getNameSortKey(b));
                case 'clean_date':
                    // Sort by clean date (oldest first = longest sober)
                    if (!a.clean_date && !b.clean_date) return 0;
                    if (!a.clean_date) return 1;
                    if (!b.clean_date) return -1;
                    return new Date(a.clean_date) - new Date(b.clean_date);
                case 'joined_date':
                    // Sort by joined date (newest first)
                    const aDate = a.user_role?.created_at;
                    const bDate = b.user_role?.created_at;
                    if (!aDate && !bDate) return 0;
                    if (!aDate) return 1;
                    if (!bDate) return -1;
                    return new Date(bDate) - new Date(aDate);
                default:
                    return 0;
            }
        });

        setFilteredMembers(filtered);
    }, [members, searchQuery, selectedHomeGroup, showSponsorsOnly, sortBy]);

    // Calculate sobriety time from clean date
    const calculateSobriety = (cleanDate) => {
        if (!cleanDate) return 'Not shared';

        const clean = new Date(cleanDate);
        const now = new Date();
        const diffTime = Math.abs(now - clean);
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
        const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));

        if (diffYears > 0) {
            if (diffMonths > 0) {
                return `${diffYears} year${diffYears > 1 ? 's' : ''}, ${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
            }
            return `${diffYears} year${diffYears > 1 ? 's' : ''}`;
        } else if (diffMonths > 0) {
            return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
        } else {
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedHomeGroup('');
        setShowSponsorsOnly(false);
        setSortBy('name');
    };

    // Set up real-time subscription and initial load
    useEffect(() => {
        // Initial load
        const initializeDirectory = async () => {
            await Promise.all([
                fetchDirectoryMembers(),
                fetchHomeGroups()
            ]);
        };

        initializeDirectory();

        // Subscribe to member profile changes
        const subscription = supabase
            .channel('directory_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'member_profiles'
                },
                () => {
                    fetchDirectoryMembers();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_roles'
                },
                () => {
                    fetchDirectoryMembers();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        loading,
        error,
        members: filteredMembers,
        homeGroups,
        searchQuery,
        setSearchQuery,
        selectedHomeGroup,
        setSelectedHomeGroup,
        showSponsorsOnly,
        setShowSponsorsOnly,
        sortBy,
        setSortBy,
        clearFilters,
        calculateSobriety,
        fetchDirectoryMembers
    };
};

export default useDirectory;