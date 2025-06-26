'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type MedStore, createMedStore } from '@/stores/med-store'

export type CounterStoreApi = ReturnType<typeof createMedStore>

export const MedStoreContext = createContext<CounterStoreApi | undefined>(
  undefined,
)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const MedStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const storeRef = useRef<CounterStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createMedStore()
  }

  return (
    <MedStoreContext.Provider value={storeRef.current}>
      {children}
    </MedStoreContext.Provider>
  )
}

export const useMedStore = <T,>(
  selector: (store: MedStore) => T,
): T => {
  const medStoreContext = useContext(MedStoreContext)

  if (!medStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`)
  }

  return useStore(medStoreContext, selector)
}
