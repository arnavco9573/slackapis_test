import { supabase } from "@/lib/supabase/client";

export async function fetchDirectoryRoles(wlPartnerId?: string) {
    // 1. Fetch WL Partners Emails
    let partners: string[] = [];
    try {
        const { data: partnerData, error: partnerError } = await supabase
            .from('wl_partners')
            .select('email');

        if (partnerError) {
            console.error("Error fetching wl_partners:", partnerError);
        } else {
            partners = (partnerData || []).map((p: any) => p.email).filter(Boolean);
            console.log("DEBUG: fetchDirectoryRoles (Client) - Found Partners:", partners);
        }
    } catch (e) {
        console.error("Exception fetching wl_partners:", e);
    }

    // 2. Fetch Admin Emails (Master Profiles)
    let admins: string[] = [];
    let adminSlackIds: string[] = [];
    try {
        const { data: adminData, error: adminError } = await supabase
            .from('master_profiles')
            .select('email, slack_user_id');

        if (adminError) {
            console.error("Error fetching master_profiles:", adminError);
        } else {
            admins = (adminData || []).map((p: any) => p.email).filter(Boolean);
            adminSlackIds = (adminData || []).map((p: any) => p.slack_user_id).filter(Boolean);

            console.log("DEBUG: fetchDirectoryRoles (Client) - Found Admins:", admins);
            console.log("DEBUG: fetchDirectoryRoles (Client) - Found Admin Slack IDs:", adminSlackIds);
        }
    } catch (e) {
        console.error("Exception fetching master_profiles:", e);
    }

    return { partners, admins, adminSlackIds };
}
