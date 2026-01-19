"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Check, X } from "lucide-react"
import { ReactNode, useState } from "react"
import { Toaster } from "react-hot-toast"

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: ' bg-red-500',
          success:{
            icon: <Check size={15} className=" text-green-500"/>,
            style: {
              padding: '10px',
              color: 'white',
              backgroundColor: 'black',
              fontSize: '12px',
              borderRadius: '2px',
              border: '1px solid #27272a',
            }
          },
           error:{
            icon: <X size={15} className=" text-red-600"/>,
            style: {
              padding: '10px',
              color: 'white',
              backgroundColor: 'black',
              fontSize: '12px',
              borderRadius: '2px',
              border: '1px solid #27272a',
            }
          },
          style: {
            padding: '8px',
            color: 'black',
            fontSize: '12px',
          },
        }}
      />
  </QueryClientProvider>
  )
}
