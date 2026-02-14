import { create } from 'zustand';

export type CabinetView = 'management' | 'list';

interface DocumentCabinetState {
    view: CabinetView;
    setView: (view: CabinetView) => void;
}

export const useDocumentCabinetStore = create<DocumentCabinetState>((set) => ({
    view: 'management',
    setView: (view: CabinetView) => set({ view }),
}));
