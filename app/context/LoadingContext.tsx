'use client'

import { createContext, useContext, useState } from 'react'

interface LoadingContextValue {
  isAppLoading: boolean
  setAppLoading: (v: boolean) => void
}

const LoadingContext = createContext<LoadingContextValue>({
  isAppLoading: true,
  setAppLoading: () => {},
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isAppLoading, setAppLoading] = useState(true)
  return (
    <LoadingContext.Provider value={{ isAppLoading, setAppLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useAppLoading() {
  return useContext(LoadingContext)
}
