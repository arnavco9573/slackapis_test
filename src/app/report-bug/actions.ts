import { createClientBrowser } from '@/lib/supabase/client';
// import { BugReport, BugReportPortal, BugReportStatus } from '@/lib/types';

export type BugReportPortal = 'master' | 'investor' | 'wl';
export type BugReportStatus = 'pending' | 'resolved';

export interface BugReport {
    id: string;
    reporter_id: string;
    title: string;
    description: string;
    category: string;
    attachment: string[];
    portal: BugReportPortal;
    status: BugReportStatus;
    created_at: string;
    duplicate_of?: string;
    reporter_name?: string;
}

const supabase = createClientBrowser();

interface FetchReportsParams {
    portal: BugReportPortal;
    search?: string;
    status?: BugReportStatus;
    page?: number;
    pageSize?: number;
}

export async function getBugReportsAction({
    portal,
    search,
    status,
    page = 1,
    pageSize = 10
}: FetchReportsParams) {
    let reporterIdsToFilter: string[] = [];

    // If search is provided, find matching reporter IDs based on portal
    if (search) {
        if (portal === 'master') {
            const { data: profiles } = await supabase
                .from('master_profiles')
                .select('user_id')
                .or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
            reporterIdsToFilter = profiles?.map((p: any) => p.user_id) || [];
        } else if (portal === 'investor') {
            const EXCLUDED_INVESTORS = ['930178a2-8c40-458f-beb6-db651b94f517'];
            console.log('Searching Investor Reporters. Exclusion filter active for:', EXCLUDED_INVESTORS);
            const { data: profiles } = await supabase
                .from('investor_profiles')
                .select('user_id')
                .or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
                .neq('user_id', '930178a2-8c40-458f-beb6-db651b94f517');
            console.log(`Bug Report Search: Found ${profiles?.length || 0} investor reporters after exclusion.`);
            reporterIdsToFilter = profiles?.map((p: any) => p.user_id) || [];
        } else if (portal === 'wl') {
            const EXCLUDED_WL_PARTNERS = [
                '599066ad-1a15-4d62-be9c-d45e57c20c71',
                'c97f3020-4d9b-4909-b0e1-ceeac7a087d2'
            ];
            console.log('Searching WL Reporters. Exclusion filter active for:', EXCLUDED_WL_PARTNERS);
            const { data: partners } = await supabase
                .from('wl_partners')
                .select('user_id')
                .ilike('manager_name', `%${search}%`)
                .neq('id', '599066ad-1a15-4d62-be9c-d45e57c20c71')
                .neq('id', 'c97f3020-4d9b-4909-b0e1-ceeac7a087d2');
            console.log(`Bug Report Search: Found ${partners?.length || 0} reporters after exclusion.`);
            reporterIdsToFilter = partners?.map((p: any) => p.user_id) || [];
        }
    }

    let query = supabase
        .from('bug_reports')
        .select('*', { count: 'exact' })
        .eq('portal', portal);

    if (status) query = query.eq('status', status);

    if (search) {
        let orFilter = `title.ilike.%${search}%,description.ilike.%${search}%`;
        if (reporterIdsToFilter.length > 0) {
            orFilter += `,reporter_id.in.(${reporterIdsToFilter.join(',')})`;
        }
        query = query.or(orFilter);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error(`Error fetching ${portal} reports:`, error);
        throw error;
    }

    if (!data || data.length === 0) return { data: [], count: 0 };

    const reporterIds = [...new Set(data.map((r: any) => r.reporter_id))];

    // Manual join logic based on portal
    let profilesMap = new Map<string, string>();

    if (portal === 'master') {
        const { data: profiles } = await supabase
            .from('master_profiles')
            .select('user_id, first_name, last_name')
            .in('user_id', reporterIds);
        profiles?.forEach((p: any) => profilesMap.set(p.user_id, `${p.first_name} ${p.last_name}`));
    } else if (portal === 'investor') {
        const { data: profiles } = await supabase
            .from('investor_profiles')
            .select('user_id, first_name, last_name')
            .in('user_id', reporterIds);
        profiles?.forEach((p: any) => profilesMap.set(p.user_id, `${p.first_name} ${p.last_name}`));
    } else if (portal === 'wl') {
        const { data: partners } = await supabase
            .from('wl_partners')
            .select('user_id, manager_name')
            .in('user_id', reporterIds);
        partners?.forEach((p: any) => profilesMap.set(p.user_id, p.manager_name));
    }

    const transformedData = data.map((report: any) => ({
        ...report,
        reporter_name: profilesMap.get(report.reporter_id) || (portal === 'master' ? 'Master' : portal === 'investor' ? 'Investor' : 'WL Manager')
    }));

    return { data: transformedData as BugReport[], count: count || 0 };
}

export async function submitBugReportAction(payload: {
    reporterId: string;
    title: string;
    description: string;
    category: string;
    attachmentUrls: string[];
    portal: BugReportPortal;
}) {
    const { data, error } = await supabase
        .from('bug_reports')
        .insert({
            reporter_id: payload.reporterId,
            title: payload.title,
            description: payload.description,
            category: payload.category,
            attachment: payload.attachmentUrls,
            portal: payload.portal,
            status: 'pending'
        })
        .select()
        .single();

    if (error) {
        console.error('Error submitting bug report:', error);
        throw error;
    }

    return data;
}

export async function getMasterProfileAction() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    let { data: profile } = await supabase
        .from('master_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (!profile && user.email) {
        const { data: profileByEmail } = await supabase
            .from('master_profiles')
            .select('*')
            .eq('email', user.email)
            .single();
        if (profileByEmail) profile = profileByEmail;
    }

    return profile ? { ...user, ...profile } : user;
}

export async function updateBugStatusAction(payload: {
    reportId: string;
    status?: BugReportStatus;
    duplicateOf?: string | null;
}) {
    const updateData: any = {};

    if (payload.status) {
        updateData.status = payload.status;
    }

    if (payload.duplicateOf !== undefined) {
        updateData.duplicate_of = payload.duplicateOf;
    }

    const { data, error } = await supabase
        .from('bug_reports')
        .update(updateData)
        .eq('id', payload.reportId)
        .select()
        .single();

    if (error) {
        console.error('Error updating bug status:', error);
        throw error;
    }

    return data;
}
