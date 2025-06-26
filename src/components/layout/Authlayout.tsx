'use client'
import { usePathname } from 'next/navigation';
import React from 'react'

const Authlayout = ({children}:{children:React.ReactNode}) => {
    const pathname = usePathname();
  return (
    <main className={`${pathname.endsWith('forgot-password') ? 'authWrapper-fp' : 'authWrapper'} h-dvh`}>
        {children}
    </main>
  )
}

export default Authlayout