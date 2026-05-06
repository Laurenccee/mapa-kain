import { create } from 'zustand';

interface ProfileState {
  hasProfile: boolean | null;
  isProfileInitialized: boolean;
  setHasProfile: (hasProfile: boolean | null) => void;
  setIsProfileInitialized: (value: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  hasProfile: null,
  isProfileInitialized: false,
  setHasProfile: (hasProfile) => set({ hasProfile }),
  setIsProfileInitialized: (value) => set({ isProfileInitialized: value }),
}));
