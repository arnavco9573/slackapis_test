export interface Asset {
    name: string;
    url: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    points: number;
    guideItems: string[];
    referenceAssets?: Asset[];
    requiresSubmission: boolean;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    tasks: Task[];
}

export const mockCategories: Category[] = [
    {
        id: 'category-2',
        name: 'Business Foundation',
        description: 'Initial agreement, payment and communication setup',
        tasks: [
            {
                id: 'task-1',
                title: 'Sign Vanquish Solution white label services Agreement',
                description: "Here's how the signing process works:\n- The agreement will be sent to the primary decision-maker listed during onboarding\n- Documents are signed digitally using Zoho e-Sign\n- No printing, scanning, or physical paperwork required\n- Signing takes approximately 2-3 minutes\nOnce signed, the agreement is automatically recorded and linked to your account.",
                points: 5,
                guideItems: [
                    'Review the agreement summary carefully',
                    'Ensure all company details are correct',
                    'Authorized signatory must be available'
                ],
                referenceAssets: [
                    { name: 'Video explanation', url: '#' }
                ],
                requiresSubmission: true
            },
            {
                id: 'task-2',
                title: 'Compliance Verification',
                description: 'Complete the necessary compliance checks and identity verification.',
                points: 10,
                guideItems: [
                    'Upload ID documents',
                    'Proof of address verification'
                ],
                requiresSubmission: false
            }
        ]
    }
];

export const mockStrategySteps = [
    { id: 'category-1', desc: 'Communication Entry' },
    { id: 'category-2', desc: 'Business Foundation' },
    { id: 'category-3', desc: 'Infrastructure Basics' },
    { id: 'category-4', desc: 'Orientation' },
    { id: 'category-5', desc: 'Strategy Selection' },
    { id: 'category-6', desc: 'Performance Verification' },
    { id: 'category-7', desc: 'Brand Identity' },
    { id: 'category-8', desc: 'Platform setup' },
    { id: 'category-9', desc: 'Capital Development' },
    { id: 'category-10', desc: 'Offering Documents' },
    { id: 'category-11', desc: 'Investor Readiness' }
];
