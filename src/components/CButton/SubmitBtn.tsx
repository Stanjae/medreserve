import { CUSTOMSUBMITBTNPROPS } from '@/types'
import { Button } from '@mantine/core'
import React from 'react'

const SubmitBtn = (props:CUSTOMSUBMITBTNPROPS) => {
    const {text, ...rest} = props
  return (
    <Button {...rest} type='submit'>{text}</Button>
  )
}

export default SubmitBtn