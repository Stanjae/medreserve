'use client'
import { Button, Checkbox, FileButton, Group, PasswordInput, Select, Text, Textarea, TextInput } from '@mantine/core'
import React from 'react'
import PhoneInput from 'react-phone-number-input'
import { DateInput, TimePicker } from '@mantine/dates';
import 'react-phone-number-input/style.css'
import { INPUTFORMPROPS } from '@/types';

const  CustomInput = (props:INPUTFORMPROPS) => {
  const {type} = props
  return (
    <div suppressHydrationWarning>
      {type == "text" && <TextInput {...props}/>}

      {type == 'password' && <PasswordInput {...props}/>}

      {type == 'checkbox' && <Checkbox  {...props} />}

      {type == "phone_no" && 
      <div>
        <label className=' leading-[21.75px] font-medium text-sm'>{props.label}</label>
        <PhoneInput  {...props}/>
      </div>}

      {type == "select" && <Select {...props}/>}

      {type == "datepicker" && <DateInput {...props} />}

      {type == "timepicker" && <TimePicker {...props} />}

      {type == "textarea" && <Textarea {...props}/>}

      {type == "fileInput" && (
        <div>
          <Group justify="center">
            <FileButton onChange={(value)=> {
              props.setFile(value);
              console.log(value);
              }} accept="image/png, image/jpeg">
              {(propis) => <Button {...propis}>{props.label}</Button>}
            </FileButton>
          </Group>

          {props.file && (
            <Text size="sm" className=" truncate"  ta="center" mt="sm">
              Picked file: {props?.file?.name}
            </Text>
          )}
        </div>
      )}


    </div>
  )
}

export default CustomInput