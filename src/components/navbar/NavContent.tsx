import { Box, Group} from '@mantine/core'
import React from 'react'
import TopNavLinks from './TopNavLinks'
import { Button } from '@mantine/core'
import Link from 'next/link'
import { MobileMainNavbar } from './MobileMainNavbar'
import MedReserveLogo from '../logo/MedReserveLogo'
//import { ColorChanger } from '../ColorChanger'

const NavContent = ({py,bg}:{bg:string; py:string}) => {

    /*  {href:"/about-us", label:"About Us", rightIcon:<IconChevronRight size={12} stroke={1.5} />},11.5px 39.2px
] */
  return (
     <Box bg={bg}  className=' overflow-hidden'>
            <Box mx="auto" py={py}  className='max-w-[calc(100%-128px)] items-center flex justify-between'>
                <MedReserveLogo/>

                <TopNavLinks/>
                 {/* <ColorChanger/> */}
                <Group className='  hidden lg:flex' >
                    <Button component={Link} href={'/book-appointment'} color="m-blue" size='md' variant='filled' className=' hover:bg-primary duration-500  font-extrabold rounded-full'>
                        Book an Appointment
                    </Button>

                    <Button component={Link} href={'/auth/login'} color="m-orange" size='md' variant='filled' className=' hover:bg-secondary duration-500  font-extrabold rounded-full'>
                        Sign-in
                    </Button>
                </Group>

                <MobileMainNavbar/>
            </Box>
            
        </Box>
  )
}

export default NavContent