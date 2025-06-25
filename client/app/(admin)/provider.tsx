"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

export const queryClient = new QueryClient()
const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#055ca3',
            color: '#fff',
          },
        }}
        containerStyle={{
          zIndex: 99999,
        }}
      />
    </QueryClientProvider>
  )
}

export default Provider