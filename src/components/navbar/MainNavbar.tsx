import { Box, Group, Text, ThemeIcon } from '@mantine/core'
import { IconBrandFacebookFilled, IconBrandX, IconBrandYoutubeFilled, IconMailOpenedFilled, IconPhoneFilled } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'
import ScrollableNavbar from './ScrollableNavbar'
import NavContent from './NavContent'

const MainNavbar = () => {
  return (
    <Box  className=' overflow-hidden' bg="m-background">
        <Box mx="auto" py="7.5"  className=' max-w-[calc(100%-20px)] flex justify-between'>
            <Group className=' justify-between lg:justify-start' >
                <Link className=' flex gap-1 items-center' href="tel:+2347015324682">
                     <ThemeIcon color="m-cyan" variant="white"><IconPhoneFilled size={'14'}/></ThemeIcon>
                    <Text size='md' c="m-gray">+234 (701) 532 4682</Text>
                </Link>
                <Link className=' flex gap-1 items-center' href="mailto:serenajandiez@gmail.com">
                     <ThemeIcon color="m-cyan" variant="white"><IconMailOpenedFilled size={'14'}/></ThemeIcon>
                    <Text size='md' c="m-gray">Info@medreserve.com</Text>
                </Link>
            </Group>


            <Group visibleFrom='xl' gap="50">
                <a className=' flex gap-1 items-center' href="https://x.com">
                     <ThemeIcon color="m-cyan" variant="white"><IconBrandX size={'14'}/></ThemeIcon>
                    <Text size='md' c="m-gray">Twitter</Text>
                </a>
                <a className=' flex gap-1 items-center' href="https://facebook.com">
                     <ThemeIcon color="m-cyan" variant="white"><IconBrandFacebookFilled size={'14'}/></ThemeIcon>
                    <Text size='md' c="m-gray">Facebook</Text>
                </a>
                <a className=' flex gap-1 items-center' href="https://facebook.com">
                     <ThemeIcon color="m-cyan" variant="white"><IconBrandYoutubeFilled size={'14'}/></ThemeIcon>
                    <Text size='md' c="m-gray">Youtube</Text>
                </a>
            </Group>
             
        </Box>
        {/* animated navbar */}
        <ScrollableNavbar>
            <NavContent bg="m-background" py="30"/>
        </ScrollableNavbar>
    </Box>
  )
}

export default MainNavbar