'use client'
import { Box} from '@mantine/core'
import { useForm } from '@mantine/form';
import React from 'react'
import CustomInput from '../inputs/CustomInput';
import SubmitBtn from '../CButton/SubmitBtn';
import { zodResolver } from 'mantine-form-zod-resolver';
import { PatientRegistrationSchema } from '@/lib/schema/zod';
import useRegistration from '@/hooks/useRegistration';


const UserRegistrationForm = () => {
  const {registerClient} = useRegistration();

  const form = useForm({mode: 'uncontrolled',
    initialValues: {email: '',password: '', username: '', terms_and_conditions: false},
    validate: zodResolver(PatientRegistrationSchema),
  validateInputOnChange: true, // validate on every change
  });

  // Check if form is valid (no errors)
  const isFormValid = Object.keys(form.errors).length === 0;

  return (
    <Box className=' space-y-3' onSubmit={form.onSubmit(async(values) => await registerClient(values, 'patient'))} component='form'>

      <CustomInput  radius={35} label='Username' size='md' type='text' 
      placeholder='Enter your username' key={form.key('username')} {...form.getInputProps('username')}/>

      <CustomInput  radius={35} label='Email' size='md' type='text' 
      placeholder='Enter your email' key={form.key('email')} {...form.getInputProps('email')}/>

       <CustomInput  radius={35} label='Password' size='md' type='password' 
      placeholder='Enter your password' key={form.key('password')} {...form.getInputProps('password')}/>

      <CustomInput className=' text-graytext'  radius={"xl"} label='I agree to Terms of Use and Privacy Policy'
      key={form.key('terms_and_conditions')} {...form.getInputProps('terms_and_conditions')} size='md' type='checkbox'/>

      
       <SubmitBtn type='submit' disabled={!isFormValid} radius={35} size='md' fullWidth loading={form.submitting} color='m-orange' text='Sign Up'/>
    </Box>
  )
}

export default UserRegistrationForm