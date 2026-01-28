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

/**
 * Create a CometChat user via REST API (Server-side only)
 * @param uid - The unique identifier (master_profile.id)
 * @param email - User's email
 */
async function createCometChatUser(uid: string, email: string) {
    try {
        console.log("🚀 Creating CometChat user with UID:", uid, "Email:", email);

        const appId = process.env.NEXT_PUBLIC_COMETCHAT_APP_ID;
        const region = process.env.NEXT_PUBLIC_COMETCHAT_REGION;
        const apiKey = process.env.COMETCHAT_API_KEY; // This should be server-side only (not NEXT_PUBLIC)

        if (!appId || !region || !apiKey) {
            throw new Error("CometChat credentials missing");
        }

        const response = await fetch(
            `https://${appId}.api-${region}.cometchat.io/v3/users`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "appId": appId,
                    "apiKey": apiKey,
                },
                body: JSON.stringify({
                    uid: uid,
                    name: email.split('@')[0], // Use email prefix as name
                    email: email,
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            // If user already exists, that's fine
            if (error.error?.code === "ERR_UID_ALREADY_EXISTS" || response.status === 409) {
                console.log("ℹ️ CometChat user already exists:", uid);
                return { success: true, alreadyExists: true };
            }
            console.error("❌ CometChat user creation failed:", error);
            return { error: error.message || "User creation failed" };
        }

        const data = await response.json();
        console.log("✅ CometChat user created successfully:", {
            uid: data.data?.uid,
            name: data.data?.name,
            email: data.data?.email
        });
        return { success: true };
    } catch (error: any) {
        console.error("❌ Error creating CometChat user:", error);
        return { error: error.message };
    }
}

/**
 * Create a SendBird user via REST API (Server-side only)
 * @param uid - The unique identifier (email prefix or master_profile.id)
 * @param email - User's email
 */
async function createSendbirdUser(uid: string, email: string) {
    try {
        console.log("🚀 Creating SendBird user with UID:", uid, "Email:", email);

        const appId = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID;
        const apiToken = process.env.SENDBIRD_API_TOKEN; // Server-side only

        if (!appId || !apiToken) {
            throw new Error("SendBird credentials missing");
        }

        const response = await fetch(
            `https://api-${appId}.sendbird.com/v3/users`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Api-Token": apiToken,
                },
                body: JSON.stringify({
                    user_id: uid,
                    nickname: email.split('@')[0],
                    profile_url: "", // Optional: Add default avatar
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            // If user already exists, that's fine
            if (error.code === 400202) { // User ID already exists
                console.log("ℹ️ SendBird user already exists:", uid);
                return { success: true, alreadyExists: true };
            }
            console.error("❌ SendBird user creation failed:", error);
            return { error: error.message || "User creation failed" };
        }

        const data = await response.json();
        console.log("✅ SendBird user created successfully:", {
            user_id: data.user_id,
            nickname: data.nickname,
        });
        return { success: true };
    } catch (error: any) {
        console.error("❌ Error creating SendBird user:", error);
        return { error: error.message };
    }
}

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

        // 4. Create CometChat user via REST API (server-side only)
        // Client-side login will happen after redirect
        if (masterProfileId) {
            // Use email prefix as UID for simpler identification
            // Or use masterProfileId if you prefer UUID
            const cometChatUid = email.split('@')[0]; // Simple UID based on email

            console.log("📱 Creating CometChat user:", { uid: cometChatUid, masterProfileId });
            const cometChatResult = await createCometChatUser(cometChatUid, email);
            if (cometChatResult.error) {
                console.error("⚠️ CometChat user creation warning:", cometChatResult.error);
                // Continue with success even if CometChat fails
            } else {
                console.log("✅ CometChat user created/verified successfully");
            }

            // 5. Create SendBird user via REST API (server-side only)
            console.log("📱 Creating SendBird user:", { uid: cometChatUid, masterProfileId });
            const sendbirdResult = await createSendbirdUser(cometChatUid, email);
            if (sendbirdResult.error) {
                console.error("⚠️ SendBird user creation warning:", sendbirdResult.error);
                // Continue with success even if SendBird fails
            } else {
                console.log("✅ SendBird user created/verified successfully");
            }

            return { success: true, masterProfileId, cometChatUid, sendbirdUid: cometChatUid };
        }

        return { success: true, masterProfileId };
    } catch (e) {
        return { error: "An unexpected error occurred." };
    }
}
