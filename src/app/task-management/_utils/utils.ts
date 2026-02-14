import { format, addDays, isValid } from 'date-fns';

export function getTitleFromCategory(category: string, status?: string) {
    switch (category) {
        case 'registration_request':
            return 'New Registration Request';
        case 'slack_onboarding':
            return 'Slack Onboarding';
        case 'assign_market_portal':
            return 'Assign Market Specific Portal';
        case 'transaction_verification':
            return 'Transaction Verification';
        case 'add_mt_account':
            return 'MT Account Creation';
        case 'withdrawal_approval':
            return 'Withdrawal Approval';
        default:
            return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
}

export function formatDate(date: string | Date | number, formatStr: string = 'dd MMM yyyy') {
    const d = new Date(date);
    if (!isValid(d)) return '-';
    return format(d, formatStr);
}

export function formatNumber(num: number | string) {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(n)) return '0';
    return n.toLocaleString('en-US');
}
