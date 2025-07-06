import Image from 'next/image'
import React from 'react'
import MedLogo from '../../../public/medreserve_logo.png'
import Link from 'next/link'

const MedReserveLogo = () => {
  return (
    <Link href={'/'}>
      <Image width={185} className=" w-[120px] h-[60px]" height={48} src={MedLogo} alt="logo" />
    </Link>
  )
}

export default MedReserveLogo