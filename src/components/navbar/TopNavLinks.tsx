'use client'
import { Toplinks } from '@/constants/Toplinks'
import { Group, NavLink } from '@mantine/core'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const TopNavLinks = () => {
    const pathname = usePathname()
  return (
    <nav className="medNavLinks hidden lg:block">
        <Group gap="2">
            {Toplinks.map(item => (
                 <NavLink  className=' customNavlink text-secondary font-bold ml-3.5 inline-block w-auto' component={Link}
                  variant='subtle' active={item.href == pathname} label={item.label} key={item.href} href={item.href}/>
            ))} 
        </Group>
    </nav>
  )
}

export default TopNavLinks