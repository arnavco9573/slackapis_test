import { create } from 'zustand';

export type CertificateView = 'LIST' | 'CREATE' | 'VIEW_EDIT' | 'LEADERBOARD';

interface Category {
    id: string;
    name: string;
    measurementType: string;
    marketType?: string;
    milestones: any[];
}

interface CertificateState {
    viewStack: CertificateView[];
    selectedCategory: Category | null;
    isEditing: boolean;

    // Actions
    pushView: (view: CertificateView, category?: Category) => void;
    popView: () => void;
    setEditing: (isEditing: boolean) => void;
    updateCategory: (updates: Partial<Category>) => void;
    reset: () => void;
}

export const useCertificateStore = create<CertificateState>((set) => ({
    viewStack: ['LIST'],
    selectedCategory: null,
    isEditing: false,

    pushView: (view, category) => set((state) => ({
        viewStack: [...state.viewStack, view],
        selectedCategory: category || state.selectedCategory,
        isEditing: false // Always start in view mode
    })),

    popView: () => set((state) => ({
        viewStack: state.viewStack.length > 1
            ? state.viewStack.slice(0, -1)
            : state.viewStack,
        selectedCategory: state.viewStack.length > 2 ? state.selectedCategory : null,
        isEditing: false
    })),

    setEditing: (isEditing) => set({ isEditing }),

    updateCategory: (updates) => set((state) => ({
        selectedCategory: state.selectedCategory
            ? { ...state.selectedCategory, ...updates }
            : null
    })),

    reset: () => set({
        viewStack: ['LIST'],
        selectedCategory: null,
        isEditing: false
    })
}));
