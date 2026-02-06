import { create } from 'zustand'

export type Step = 'init' | 'timezone' | 'availability' | 'review' | 'color'

export type TeamMember = {
    id: string
    name: string
    workspace_email: string
    color?: string
    avatar_url?: string
    is_active?: boolean
}

export type DayAvailability = {
    start: string
    end: string
}

export type Availability = {
    [key: string]: DayAvailability[]
}

interface SyncState {
    step: Step
    setStep: (step: Step) => void
    members: TeamMember[]
    setMembers: (members: TeamMember[] | ((prev: TeamMember[]) => TeamMember[])) => void
    timezone: string
    setTimezone: (timezone: string) => void
    availability: Availability
    setAvailability: (availability: Availability) => void
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
    timezone: '',
    setTimezone: (timezone) => set({ timezone }),
    availability: {
        mon: [{ start: '09:00', end: '17:00' }],
        tue: [{ start: '09:00', end: '17:00' }],
        wed: [{ start: '09:00', end: '17:00' }],
        thu: [{ start: '09:00', end: '17:00' }],
        fri: [{ start: '09:00', end: '17:00' }],
        sat: [],
        sun: []
    },
    setAvailability: (availability) => set({ availability }),
    isLoading: false,
    setLoading: (isLoading) => set({ isLoading }),
}))
