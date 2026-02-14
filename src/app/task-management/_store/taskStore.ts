import { create } from 'zustand';
import { Task } from '../_utils/tasks';

interface TaskStore {
    currentTask: Task | null;
    isLoading: boolean;
    setTask: (task: Task) => void;
    updateTaskStatus: (status: Task['status']) => void;
    completeTask: () => Promise<void>;
    resetTask: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    currentTask: null,
    isLoading: false,

    setTask: (task) => set({ currentTask: task }),

    updateTaskStatus: (status) =>
        set((state) => ({
            currentTask: state.currentTask
                ? { ...state.currentTask, status }
                : null,
        })),

    completeTask: async () => {
        set({ isLoading: true });
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            set((state) => ({
                currentTask: state.currentTask
                    ? { ...state.currentTask, status: 'completed' }
                    : null,
                isLoading: false,
            }));
        } catch (error) {
            console.error('Failed to complete task:', error);
            set({ isLoading: false });
        }
    },

    resetTask: () => set({ currentTask: null, isLoading: false }),
}));
