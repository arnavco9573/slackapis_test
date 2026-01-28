import { create } from 'zustand';

export type AuthView = 'SIGN_IN' | 'OTP' | 'SUCCESS';

interface AuthFlowState {
    viewStack: AuthView[];
    push: (view: AuthView) => void;
    pop: () => void;
    reset: () => void;
    currentView: () => AuthView;
    email: string;
    setEmail: (email: string) => void;
}

export const useAuthFlowStore = create<AuthFlowState>((set, get) => ({
    viewStack: ['SIGN_IN'],

    push: (view: AuthView) => set((state) => ({
        viewStack: [...state.viewStack, view]
    })),

    pop: () => set((state) => {
        if (state.viewStack.length <= 1) return state;
        return { viewStack: state.viewStack.slice(0, -1) };
    }),

    reset: () => set({ viewStack: ['SIGN_IN'] }),

    currentView: () => {
        const stack = get().viewStack;
        return stack[stack.length - 1];
    },

    email: '',
    setEmail: (email: string) => set({ email })
}));
