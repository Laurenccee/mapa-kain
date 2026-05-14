import { create } from "zustand";

interface ProfileState {
  hasProfile: boolean | null;
  isProfileInitialized: boolean;
  hasCarenderia: boolean | null;
  setHasProfile: (hasProfile: boolean | null) => void;
  setIsProfileInitialized: (value: boolean) => void;
  setHasCarenderia: (value: boolean | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  hasProfile: null,
  isProfileInitialized: false,
  hasCarenderia: null,
  setHasProfile: (hasProfile) => set({ hasProfile }),
  setIsProfileInitialized: (value) => set({ isProfileInitialized: value }),
  setHasCarenderia: (value) => set({ hasCarenderia: value }),
}));
