import Image from 'next/image'
import React from 'react'
import MedLogo from '../../../public/medreserve_logo.png'

const MedReserveLogo = () => {
  return (
    <Image width={185} className=" w-[120px] h-[60px]" height={48} src={MedLogo} alt="logo"/>
  )
}

export default MedReserveLogo