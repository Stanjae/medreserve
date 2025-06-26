'use client'
import { Box} from '@mantine/core'
import { useForm } from '@mantine/form';
import React from 'react'
import CustomInput from '../inputs/CustomInput';
import SubmitBtn from '../CButton/SubmitBtn';
import { zodResolver } from 'mantine-form-zod-resolver';
import { PatientLoginSchema } from '@/lib/schema/zod';
import usePatientLogin from '@/hooks/usePatientLogin';


const UserLoginForm = () => {
  const {loginPatient} = usePatientLogin()

  const form = useForm({mode: 'uncontrolled',
    initialValues: {email: '',password: ''},
    validate: zodResolver(PatientLoginSchema),
  validateInputOnChange: true, // validate on every change
  });

  // Check if form is valid (no errors)
  const isFormValid = Object.keys(form.errors).length === 0;

  return (
    <Box className=' space-y-3' onSubmit={form.onSubmit(async(values) => await loginPatient(values))} component='form'>

      <CustomInput  radius={35} label='Email' size='md' type='text' 
      placeholder='Enter your email' key={form.key('email')} {...form.getInputProps('email')}/>

       <CustomInput  radius={35} label='Password' size='md' type='password' 
      placeholder='Enter your password' key={form.key('password')} {...form.getInputProps('password')}/>

      
       <SubmitBtn type='submit' disabled={!isFormValid} radius={35} size='md' 
       fullWidth loading={form.submitting} color='m-orange' text='Sign in'/>
    </Box>
  )
}

export default UserLoginForm