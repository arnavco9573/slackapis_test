export interface Task {
    id: string;
    category: string;
    status: 'todo' | 'pending' | 'completed' | 'rejected';
    description: string;
    tag: string;
    created_at: string;
    wl_partner?: {
        id: string;
        company_name: string;
        manager_name: string;
        email: string;
        phone: string;
        country: string;
        state: string;
        city: string;
        zip: string;
        address: string;
        registration_date: string;
        onboarding_date: string;
        market_request?: string;
    };
    investor?: {
        user_id: string;
        first_name: string;
        last_name: string;
    };
    transaction?: {
        amount: number;
        reference_code: string;
        type: string;
    };
    investor_transaction_id?: string;
}

export const dummyTasks: Task[] = [
    {
        id: 'T77834',
        category: 'registration_request',
        status: 'todo',
        description: 'Evaluate and approve new WL registration requests.',
        tag: 'New Registration',
        created_at: '2025-01-15T10:00:00Z',
        wl_partner: {
            id: 'WL-101',
            company_name: 'Bloom moon',
            manager_name: 'Andrew Zen',
            email: 'bloom@gamil.com',
            phone: '+44 7700 900123',
            country: 'United Kingdom',
            state: 'England',
            city: 'Edinburgh',
            zip: 'EH1',
            address: '15 Royal Mile, Old Town',
            registration_date: '2025-01-15T10:00:00Z',
            onboarding_date: '2025-01-15T10:00:00Z',
            market_request: 'Global'
        }
    },
    {
        id: 'T77835',
        category: 'slack_onboarding',
        status: 'todo',
        description: 'Onboard user using the submitted Slack email.',
        tag: 'Connect Slack',
        created_at: '2025-01-15T11:00:00Z',
        wl_partner: {
            id: 'WL-101',
            company_name: 'Bloom moon',
            manager_name: 'Andrew Zen',
            email: 'bloom@gamil.com',
            phone: '+44 7700 900123',
            country: 'United Kingdom',
            state: 'England',
            city: 'Edinburgh',
            zip: 'EH1',
            address: '15 Royal Mile, Old Town',
            registration_date: '2025-01-15T10:00:00Z',
            onboarding_date: '2025-01-15T10:00:00Z',
            market_request: 'USA + Global'
        }
    },
    {
        id: 'T77836',
        category: 'assign_market_portal',
        status: 'todo',
        description: 'Assign portal access to the partner',
        tag: 'Assign Portal',
        created_at: '2025-01-15T12:00:00Z',
        wl_partner: {
            id: 'WL-101',
            company_name: 'Bloom moon',
            manager_name: 'Andrew Zen',
            email: 'bloom@gamil.com',
            phone: '+44 7700 900123',
            country: 'United Kingdom',
            state: 'England',
            city: 'Edinburgh',
            zip: 'EH1',
            address: '15 Royal Mile, Old Town',
            registration_date: '2025-01-15T10:00:00Z',
            onboarding_date: '2025-01-15T10:00:00Z',
            market_request: 'USA'
        }
    },
    {
        id: 'T77837',
        category: 'calendar_email_change',
        status: 'todo',
        description: 'Approve calendar email change request.',
        tag: 'Switch calendar',
        created_at: '2025-01-15T13:00:00Z',
        wl_partner: {
            id: 'WL-101',
            company_name: 'Bloom moon',
            manager_name: 'Andrew Zen',
            email: 'bloom@gamil.com',
            phone: '+44 7700 900123',
            country: 'United Kingdom',
            state: 'England',
            city: 'Edinburgh',
            zip: 'EH1',
            address: '15 Royal Mile, Old Town',
            registration_date: '2025-01-15T10:00:00Z',
            onboarding_date: '2025-01-15T10:00:00Z',
            market_request: 'USA + Global'
        }
    },
    {
        id: 'T77838',
        category: 'support_request',
        status: 'todo',
        description: 'New support ticket received.',
        tag: 'Support ticket',
        created_at: '2025-01-15T14:00:00Z',
        wl_partner: {
            id: 'WL-101',
            company_name: 'Bloom moon',
            manager_name: 'Andrew Zen',
            email: 'bloom@gamil.com',
            phone: '+44 7700 900123',
            country: 'United Kingdom',
            state: 'England',
            city: 'Edinburgh',
            zip: 'EH1',
            address: '15 Royal Mile, Old Town',
            registration_date: '2025-01-15T10:00:00Z',
            onboarding_date: '2025-01-15T10:00:00Z',
            market_request: 'USA + Global'
        }
    }
];
