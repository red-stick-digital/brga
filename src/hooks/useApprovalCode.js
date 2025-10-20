import { useState } from 'react';
import supabase from '../services/supabase';

const useApprovalCode = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validateCode = async (code) => {
        setLoading(true);
        setError(null);

        if (!code || typeof code !== 'string') {
            setError('Approval code is required');
            setLoading(false);
            return { valid: false, error: 'Approval code is required' };
        }

        // Format: three words separated by hyphens (e.g., "fish-taco-burrito")
        const codePattern = /^[a-zA-Z]+-[a-zA-Z]+-[a-zA-Z]+$/;
        if (!codePattern.test(code.trim())) {
            setError('Invalid code format. Use format: word-word-word');
            setLoading(false);
            return { valid: false, error: 'Invalid code format. Use format: word-word-word' };
        }

        const normalizedCode = code.trim().toLowerCase();

        try {
            // Check if code exists and is valid
            const { data: codeData, error: fetchError } = await supabase
                .from('approval_codes')
                .select('*')
                .eq('code', normalizedCode)
                .single();

            if (fetchError || !codeData) {
                setError('Invalid approval code');
                setLoading(false);
                return { valid: false, error: 'Invalid approval code' };
            }

            // Check if code is already used
            if (codeData.used_by) {
                setError('This approval code has already been used');
                setLoading(false);
                return { valid: false, error: 'This approval code has already been used' };
            }

            // Check if code is expired
            const now = new Date();
            const expiresAt = new Date(codeData.expires_at);
            if (now > expiresAt) {
                setError('This approval code has expired');
                setLoading(false);
                return { valid: false, error: 'This approval code has expired' };
            }

            setLoading(false);
            return { valid: true, codeData };

        } catch (err) {
            console.error('Error validating approval code:', err);
            setError('Failed to validate approval code');
            setLoading(false);
            return { valid: false, error: 'Failed to validate approval code' };
        }
    };

    const markCodeAsUsed = async (code, userId) => {
        setLoading(true);
        setError(null);

        // If no code provided, skip the database update
        if (!code || typeof code !== 'string' || code.trim() === '') {
            setLoading(false);
            return { success: true, data: null }; // Success because no code to mark as used
        }

        const normalizedCode = code.trim().toLowerCase();

        try {
            const { data, error: updateError } = await supabase
                .from('approval_codes')
                .update({
                    used_by: userId,
                    used_at: new Date().toISOString()
                })
                .eq('code', normalizedCode)
                .eq('used_by', null) // Only update if not already used
                .single();

            if (updateError) {
                console.error('Error marking code as used:', updateError);
                setError('Failed to process approval code');
                setLoading(false);
                return { success: false, error: 'Failed to process approval code' };
            }

            setLoading(false);
            return { success: true, data };

        } catch (err) {
            console.error('Error marking code as used:', err);
            setError('Failed to process approval code');
            setLoading(false);
            return { success: false, error: 'Failed to process approval code' };
        }
    };

    return {
        validateCode,
        markCodeAsUsed,
        loading,
        error,
        setError
    };
};

export default useApprovalCode;