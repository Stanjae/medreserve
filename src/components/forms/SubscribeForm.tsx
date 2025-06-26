'use client'
import { ActionIcon, Box, Text, TextInput } from '@mantine/core'
import React from 'react'
import { useForm } from '@mantine/form';
import { IconCheck } from '@tabler/icons-react';

const SubscribeForm = () => {
     const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  /* #22306d
letter-spacing:
0.32px
line-height:
24px
padding:
3.5px 7.5px 4px 28px */

  return (
   <Box component='form' className="space-y-3" onSubmit={form.onSubmit((values) => console.log(values))}>
        <div id="subscribeFormWrapper" className=' relative'>
            <TextInput variant='filled' radius={35} size='lg' color="m-blue.7" c={'m-background'} key={form.key('email')} {...form.getInputProps('email')} placeholder='Email Address' 
            className=' w-full  ' />
            <ActionIcon className=' right-5 top-1/2 -translate-y-1/2 absolute' radius={'lg'} size={24}>
                <IconCheck/>
            </ActionIcon>
        </div>
        <Text c="m-gray" className=' ml-[16px] leading-[30px] text-sm'>Unsubscribe anytime.</Text>
   </Box>
  )
}

export default SubscribeForm