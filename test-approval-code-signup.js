#!/usr/bin/env node

// Test script for approval code signup
// This will create a test approval code and test the signup flow

import supabase from './src/services/supabase.js';

const testApprovalCodeSignup = async () => {
    console.log('🧪 Testing approval code signup flow...');

    // Step 1: Create a test approval code
    const testCode = 'test-fish-taco';
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    try {
        // First check if a test code already exists
        const { data: existingCode } = await supabase
            .from('approval_codes')
            .select('*')
            .eq('code', testCode)
            .single();

        if (!existingCode) {
            // Create test approval code
            console.log('📝 Creating test approval code:', testCode);

            // We need an admin user ID for created_by field
            // Let's get the first admin user
            const { data: adminUsers } = await supabase
                .from('user_roles')
                .select('user_id')
                .in('approval_status', ['admin', 'superadmin'])
                .limit(1);

            if (!adminUsers || adminUsers.length === 0) {
                console.error('❌ No admin users found to create approval code');
                return;
            }

            const { data: codeData, error: codeError } = await supabase
                .from('approval_codes')
                .insert({
                    code: testCode,
                    created_by: adminUsers[0].user_id,
                    expires_at: expiresAt.toISOString()
                })
                .select()
                .single();

            if (codeError) {
                console.error('❌ Error creating test approval code:', codeError);
                return;
            }

            console.log('✅ Created test approval code:', codeData);
        } else {
            console.log('ℹ️  Test approval code already exists:', existingCode);
        }

        // Step 2: Test the validation
        console.log('\n🔍 Testing approval code validation...');

        const { data: validationResult } = await supabase.rpc('validate_approval_code', {
            code_input: testCode
        });

        console.log('Validation result:', validationResult);

        console.log('\n✅ Test setup complete!');
        console.log('🔧 You can now test signup with approval code:', testCode);
        console.log('📧 Test email: test-user-' + Date.now() + '@example.com');
        console.log('🔗 Signup URL: http://localhost:3001/signup');

    } catch (error) {
        console.error('❌ Error during test setup:', error);
    }
};

// Run the test
testApprovalCodeSignup();