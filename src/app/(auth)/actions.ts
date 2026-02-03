'use server';

import { createAdminClient } from "@/lib/supabase/server";

export async function signInWithEmailAction(email: string) {
    try {
        const supabase = createAdminClient();

        // 1. Check if email exists in master_access
        const { data: existingUser, error: checkError } = await supabase
            .from('master_access')
            .select('email')
            .eq('email', email)
            .single();

        if (checkError || !existingUser) {
            return { error: "Unauthorized access. Email not found." };
        }

        // 2. Send OTP
        const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
            }
        });

        if (otpError) {
            return { error: otpError.message };
        }

        return { success: true };
    } catch (e) {
        return { error: "An unexpected error occurred." };
    }
}

import { createClientServer } from "@/lib/supabase/server";





export async function verifyOtpAction(email: string, otp: string) {
    try {
        const supabase = await createClientServer();

        // 1. Verify OTP
        // Try 'email' (Magic Link/OTP for existing users) first
        let { data, error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email'
        });

        // If that fails, try 'signup' (for new users who just got created)
        if (verifyError) {
            const res = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'signup'
            });
            data = res.data;
            verifyError = res.error;
        }

        if (verifyError || !data.session) {
            return { error: verifyError?.message || "Verification failed." };
        }

        const session = data.session;

        // 2. Get or Create master_profile to get its UUID
        const adminSupabase = createAdminClient();

        let masterProfileId: string | undefined;

        const { data: profile } = await adminSupabase
            .from('master_profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (profile) {
            masterProfileId = profile.id;
        } else {
            // Create new master_profile if not exists
            const { data: newProfile, error: createError } = await adminSupabase
                .from('master_profiles')
                .insert({ email })
                .select('id')
                .single();

            if (createError) {
                console.error("Failed to create master profile:", createError);
                return { success: true, warning: "LoggedIn but profile creation failed" };
            }
            masterProfileId = newProfile.id;
        }

        // 3. Upsert into 'users' table
        // We link auth.users.id (session.user.id) to this record
        const { error: userInsertError } = await adminSupabase
            .from('users')
            .upsert({
                id: session.user.id,
                email: email,
                role: 'master',
                master_userId: masterProfileId,
                wl_partner_userId: null
            });

        if (userInsertError) {
            console.error("Failed to create/update user record:", userInsertError);
        }



        return { success: true, masterProfileId };
    } catch (e) {
        return { error: "An unexpected error occurred." };
    }
}
