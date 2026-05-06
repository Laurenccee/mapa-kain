import { create } from 'zustand';

interface ProfileState {
  hasProfile: boolean | null;
  setHasProfile: (hasProfile: boolean | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  hasProfile: null,
  setHasProfile: (hasProfile) => set({ hasProfile }),
}));
