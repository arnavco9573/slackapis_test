'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useTaskStore } from '../_store/taskStore';
import { dummyTasks } from '../_utils/tasks';

// Feature Components
import RegistrationRequestDetails from './features/wl-operations/registration-request-details';
import SlackOnboardingDetails from './features/wl-operations/slack-onboarding-details';
import AssignMarketPortalDetails from './features/wl-operations/assign-market-portal-details';
import CalendarChangeDetails from './features/calendar/calendar-change-details';
import SupportTicketDetails from './features/support/support-ticket-details';
import GenericTaskDetails from './features/common/generic-task-details';

export default function TaskDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { currentTask, setTask, isLoading } = useTaskStore();

    useEffect(() => {
        const task = dummyTasks.find((t) => t.id === id);
        if (task) {
            setTask(task);
        }
    }, [id, setTask]);

    if (isLoading || !currentTask) {
        return (
            <div className="flex items-center justify-center min-h-screen text-text-mid">
                Loading task...
            </div>
        );
    }

    // Route to feature-specific components based on task category
    switch (currentTask.category) {
        case 'registration_request':
            return <RegistrationRequestDetails />;
        case 'slack_onboarding':
            return <SlackOnboardingDetails />;
        case 'assign_market_portal':
            return <AssignMarketPortalDetails />;
        case 'calendar_email_change':
            return <CalendarChangeDetails />;
        case 'support_request':
            return <SupportTicketDetails />;
        default:
            return <GenericTaskDetails />;
    }
}
