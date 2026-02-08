"use server";

import { createClientServer } from "@/lib/supabase/server";
import { clearSlackCache } from "./slack-actions";

export async function disconnectSlack() {
    try {
        const supabase = await createClientServer();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { success: false, error: "Not authenticated" };

        const { error } = await supabase
            .from('master_profiles')
            .update({
                slack_access_token: null,
                slack_user_id: null
            })
            .eq('id', user.id);

        if (error) throw error;

        await clearSlackCache();

        return { success: true };
    } catch (e) {
        console.error("Error disconnecting Slack:", e);
        return { success: false, error: e };
    }
}
