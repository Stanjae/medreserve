// src/stores/counter-store.ts
import { AuthCredentials} from '@/types/store'
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

export type MedState = {
  credentials: AuthCredentials | null;
}

export type MedActions = {
  setAuthCredentials: (params: AuthCredentials | undefined) => void;
  clearAuthCredentials: () => void;
}

export type MedStore = MedState & MedActions

export const initMedStore = (): MedState => {
  return { credentials: null}
}

export const defaultInitState: MedState = {
  credentials: null
}

export const createMedStore = (
  initState: MedState = defaultInitState,
) => {
  return createStore<MedStore>()(
    persist(
      (set) => ({
      ...initState,
      setAuthCredentials: (paramsAuth) => set(() => ({credentials: paramsAuth})),
      clearAuthCredentials: () => set(() => ({ credentials: null })),
      }),
      {name: 'med-store'},
    ),   
  )
}
