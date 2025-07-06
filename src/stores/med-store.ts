// src/stores/counter-store.ts
import { AuthCredentials } from "@/types/store";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

export type MedState = {
  credentials: AuthCredentials | null;
  weekSchedule: string[] | null;
  dateTime: {
    startTime?: string;
    endTime?: string;
    date: string;
    minTime: string;
    maxTime: string;
  };
};

export type MedActions = {
  setAuthCredentials: (params: AuthCredentials | undefined) => void;
  clearAuthCredentials: () => void;
  setWeekSchedule: (params: string[] | null) => void;
  clearWeekSchedule: () => void;
  setDateTime: (params: {
    startTime?: string;
    endTime?: string;
    date: string;
    minTime: string;
    maxTime: string;
  }) => void;
};

export type MedStore = MedState & MedActions;

export const initMedStore = (): MedState => {
  return {
    credentials: null,
    weekSchedule: [],
    dateTime: {
      startTime: "",
      endTime: "",
      date: "",
      minTime: "",
      maxTime: "",
    },
  };
};

export const defaultInitState: MedState = {
  credentials: null,
  weekSchedule: [],
  dateTime: { startTime: "", endTime: "", date: "", minTime: "", maxTime: "" },
};

export const createMedStore = (initState: MedState = defaultInitState) => {
  return createStore<MedStore>()(
    persist(
      (set) => ({
        ...initState,
        setAuthCredentials: (paramsAuth) =>
          set(() => ({ credentials: paramsAuth })),
        clearAuthCredentials: () => set(() => ({ credentials: null })),
        setWeekSchedule: (paramsWeekSchedule) =>
          set(() => ({ weekSchedule: paramsWeekSchedule })),
        clearWeekSchedule: () => set(() => ({ weekSchedule: [] })),
        setDateTime: (params) => set(() => ({ dateTime: params })),
      }),
      { name: "med-store" }
    )
  );
};
