import { dummyTasks } from './tasks';

export function useNextTask(
    investor_transaction_id?: string,
    currentTaskId?: string,
    isCurrentCompleted?: boolean,
    category?: string,
    transactionType?: string
) {
    // In a real app, this would fetch from an API
    // For dummy data, we'll find the next task in the array if the current one is completed

    const currentIndex = dummyTasks.findIndex(t => t.id === currentTaskId);
    const nextTask = currentIndex !== -1 && currentIndex < dummyTasks.length - 1
        ? dummyTasks[currentIndex + 1]
        : null;

    return {
        data: nextTask,
        isLoading: false
    };
}
