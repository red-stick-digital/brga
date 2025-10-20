import { useState, useEffect } from 'react';
import supabase from '../services/supabase';

const useApprovalCodes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [codes, setCodes] = useState([]);

    // Generate a three-word approval code
    const generateThreeWordCode = () => {
        const words = [
            'apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'garden', 'honey',
            'island', 'jungle', 'kitten', 'lemon', 'mountain', 'nugget', 'ocean', 'purple',
            'quiet', 'river', 'sunshine', 'turtle', 'umbrella', 'violet', 'window', 'yellow',
            'zebra', 'bridge', 'castle', 'dolphin', 'elephant', 'flower', 'guitar', 'hamster'
        ];

        const getRandomWord = () => words[Math.floor(Math.random() * words.length)];
        return `${getRandomWord()}-${getRandomWord()}-${getRandomWord()}`;
    };

    // Generate new approval code(s)
    const generateCodes = async (count = 1, expirationDays = 30) => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + expirationDays);

            const newCodes = [];
            for (let i = 0; i < count; i++) {
                let code;
                let attempts = 0;
                let unique = false;

                // Generate unique codes (retry if duplicate)
                while (!unique && attempts < 10) {
                    code = generateThreeWordCode();

                    // Check if code already exists
                    const { data: existingCode, error: checkError } = await supabase
                        .from('approval_codes')
                        .select('code')
                        .eq('code', code)
                        .single();

                    if (checkError && checkError.code === 'PGRST116') {
                        // Code doesn't exist, we can use it
                        unique = true;
                    } else if (existingCode) {
                        // Code exists, try again
                        attempts++;
                    } else {
                        // Other error
                        throw checkError;
                    }
                }

                if (!unique) {
                    throw new Error('Failed to generate unique code after multiple attempts');
                }

                newCodes.push({
                    code,
                    created_by: user.id,
                    expires_at: expiresAt.toISOString(),
                    used_by: null,
                    used_at: null
                });
            }

            const { data, error: insertError } = await supabase
                .from('approval_codes')
                .insert(newCodes)
                .select('*');

            if (insertError) {
                throw insertError;
            }

            setLoading(false);
            return { success: true, codes: data };

        } catch (err) {
            console.error('Error generating approval codes:', err);
            setError(err.message || 'Failed to generate approval codes');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to generate approval codes' };
        }
    };

    // Fetch all approval codes with optional filters
    const fetchCodes = async (filters = {}) => {
        setLoading(true);
        setError(null);

        try {
            let query = supabase
                .from('approval_codes')
                .select(`
                    *,
                    created_by_user:created_by(email),
                    used_by_user:used_by(email)
                `)
                .order('created_at', { ascending: false });

            // Apply filters
            if (filters.status === 'unused') {
                query = query.is('used_by', null);
            } else if (filters.status === 'used') {
                query = query.not('used_by', 'is', null);
            } else if (filters.status === 'expired') {
                query = query
                    .is('used_by', null)
                    .lt('expires_at', new Date().toISOString());
            }

            if (filters.search) {
                query = query.or(
                    `code.ilike.%${filters.search}%,created_by_user.email.ilike.%${filters.search}%,used_by_user.email.ilike.%${filters.search}%`
                );
            }

            const { data, error: fetchError } = await query;

            if (fetchError) {
                throw fetchError;
            }

            setCodes(data || []);
            setLoading(false);
            return { success: true, codes: data || [] };

        } catch (err) {
            console.error('Error fetching approval codes:', err);
            setError(err.message || 'Failed to fetch approval codes');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to fetch approval codes' };
        }
    };

    // Delete unused codes
    const deleteCodes = async (codeIds) => {
        setLoading(true);
        setError(null);

        try {
            const { error: deleteError } = await supabase
                .from('approval_codes')
                .delete()
                .in('id', codeIds)
                .is('used_by', null); // Only delete unused codes

            if (deleteError) {
                throw deleteError;
            }

            setLoading(false);
            return { success: true };

        } catch (err) {
            console.error('Error deleting approval codes:', err);
            setError(err.message || 'Failed to delete approval codes');
            setLoading(false);
            return { success: false, error: err.message || 'Failed to delete approval codes' };
        }
    };

    // Set up real-time subscription for code changes
    useEffect(() => {
        const subscription = supabase
            .channel('approval_codes_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'approval_codes' },
                (payload) => {
                    console.log('Approval codes changed:', payload);
                    // Refresh codes when changes occur
                    fetchCodes();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        codes,
        loading,
        error,
        generateCodes,
        fetchCodes,
        deleteCodes,
        setError
    };
};

export default useApprovalCodes;