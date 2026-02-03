import { create } from 'zustand'

export type Step = 'init' | 'review' | 'color'

export type TeamMember = {
    id: string
    name: string
    workspace_email: string
    color?: string
    avatar_url?: string
    is_active?: boolean
}

interface SyncState {
    step: Step
    setStep: (step: Step) => void
    members: TeamMember[]
    setMembers: (members: TeamMember[] | ((prev: TeamMember[]) => TeamMember[])) => void
    isLoading: boolean
    setLoading: (loading: boolean) => void
}

export const useSyncStore = create<SyncState>((set) => ({
    step: 'init',
    setStep: (step) => set({ step }),
    members: [],
    setMembers: (update) => set((state) => ({
        members: typeof update === 'function' ? update(state.members) : update
    })),
    isLoading: false,
    setLoading: (isLoading) => set({ isLoading }),
}))
