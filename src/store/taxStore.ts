import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TaxProfile, emptyProfile } from "@/types/tax";

interface TaxStore {
  profile: TaxProfile;
  currentStep: number;
  totalSteps: number;
  hasStarted: boolean;
  updateProfile: (updates: Partial<TaxProfile>) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  startReport: () => void;
}

export const useTaxStore = create<TaxStore>()(
  persist(
    (set) => ({
      profile: emptyProfile,
      currentStep: 0,
      totalSteps: 36, // 24 (stages 0-3) + 9 (stage 4 Box 3) + 3 (stage 5 Housing)
      hasStarted: false,

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      setStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      reset: () => set({ profile: emptyProfile, currentStep: 0, hasStarted: false }),
      startReport: () => set({ hasStarted: true }),
    }),
    {
      name: "easytax-profile",
    }
  )
);
