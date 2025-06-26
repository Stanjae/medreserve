'use client'
import { Box } from '@mantine/core'
import React from 'react'
import CustomInput from '../inputs/CustomInput'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import SubmitBtn from '../CButton/SubmitBtn'
import useForgotPw from '@/hooks/useForgotPw'
import { ForgotPasswordSchema } from '@/lib/schema/zod'

const ForgotPwForm = () => {
    const {forgotPasswordPatient} = useForgotPw()
     const form = useForm({mode: 'uncontrolled',
        initialValues: {email: '',},
        validate: zodResolver(ForgotPasswordSchema),
      validateInputOnChange: true, // validate on every change
      });
      const isFormValid = Object.keys(form.errors).length === 0;
  return (
    <Box className=' space-y-3' onSubmit={form.onSubmit(async(values) => await forgotPasswordPatient(values))} component='form'>

      <CustomInput  radius={35} label='Email' size='md' type='text' 
      placeholder='Enter your email' key={form.key('email')} {...form.getInputProps('email')}/>
      
       <SubmitBtn type='submit' disabled={!isFormValid} radius={35} size='md' 
       fullWidth loading={form.submitting} color='m-orange' text='Submit'/>
    </Box>
  )
}

export default ForgotPwForm