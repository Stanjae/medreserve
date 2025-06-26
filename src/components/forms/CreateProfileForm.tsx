'use client'
import { Box, Button, Grid, GridCol, Group, Paper, Stepper, Text} from '@mantine/core'
import { useForm } from '@mantine/form';
import React, { useEffect, useState } from 'react'
import CustomInput from '../inputs/CustomInput';
import dayjs from 'dayjs';
import { DateInputProps } from '@mantine/dates';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { bloodGroups, genderData, genotypes, IdentificationTypes } from '@/constants';
import { PatientStepFormValidation } from '@/lib/schema/zod';
import { useMedStore } from '@/providers/med-provider';
import { CreatePatientProfileParams } from '@/types/actions.types';
import { handleFileUpload } from '@/utils/utilsFn';
import { DropzoneWrapper } from '../dropzone/Dropzone';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { createPatientAction } from '@/lib/actions/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

dayjs.extend(customParseFormat);

const CreateProfileForm = () => {

  const [active, setActive] = useState(0);
  const { credentials } = useMedStore(state => state);

  const [file, setFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const router = useRouter();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      "fullname": '',
      address: '',
      email: '',
      phone: '',
      occupation: '',
      emergencyContactName: '',
      emergencyContactNumber:'',
      birthDate: '',
      bloodGroup: '',
      genotype: '',
      insurancePolicyNumber: '',
      insuranceProvider: '',
      allergies: '',
      currentMedication: '',
      familyMedicalHistory: '',
      pastMedicalHistory: '',
      identificationType: '',
      identificationNumber: '',
      identificationDocument: '',
      profilePicture: '',
      privacyConsent: false
    },
   validate: (values)=>{
    const schema = PatientStepFormValidation[active];
    if (!schema) return {};

    // Parse the current values with the schema
    const result = schema.safeParse(values);

    if (result.success) {
      return {};
    } else {
      // Map Zod errors to Mantine form error format
      const errors: { [key: string]: string } = {};
      for (const err of result.error.errors) {
        if (err.path.length > 0) {
          errors[err.path[0]] = err.message;
        }
      }
      return errors;
    }
  },
})


  useEffect(() => {
    if(credentials?.emailVerified){
      router.push(`/patient/${credentials?.userId}/dashboard`);
      return;
    }
      form.setValues({'email': credentials?.email});
      form.setFieldValue("userId", credentials?.userId);
  }, [credentials]);

   const nextStep = () => {
      const validationErrors = form.validate();
      if (!validationErrors.hasErrors) {
        setActive((current) => (current < 3 ? current + 1 : current));
        return
      }
      console.log(validationErrors.errors, form.errors);
    };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
}
  const dateParser: DateInputProps['dateParser'] = (input) => {
    return dayjs(input, 'YYYY MMMM DD').format('YYYY-MM-DD');
};

  const handleSubmit = async(values:CreatePatientProfileParams) => {
      const photoUrl = await handleFileUpload(file!);
      const documentUrl = await handleFileUpload(documentFile!);
      const data = {"userId": credentials?.userId,...values, profilePicture: photoUrl, identificationDocument: documentUrl};
      const response = await createPatientAction(data);
      if(response?.code !== 200){
        toast.error(response?.message);
        return
      }
      toast.success(response?.message);
      setTimeout(() => {
        router.push(`/patient/${credentials?.userId}/dashboard`);
      }, 1000);
    
  }
  return (
    <Paper shadow="md" className=" card py-[46px] space-y-4 px-[70px] w-full max-w-[992px]">
      <Box onSubmit={form.onSubmit((values) =>handleSubmit(values))} component="form">
          <Stepper active={active}>
            <Stepper.Step label="First step" description="Personal information">
                <Grid overflow='hidden'>
                    <GridCol span={{base:12}}>
                            <CustomInput type="text"
                                label="Full Name"
                                radius={35}
                                withAsterisk
                                size='md'
                                placeholder="Enter your full name"
                                key={form.key('fullname')}
                                {...form.getInputProps('fullname')}
                            />
                    </GridCol>

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="text"
                                label="Email"
                                radius={35}
                                readOnly
                                size='md'
                                placeholder="Enter your email"
                                key={form.key('email')}
                                {...form.getInputProps('email')}
                            />
                    </GridCol>

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="phone_no"
                                label="Phone Number"
                                placeholder="Enter your Phone Number"
                                className=' phone-no'
                                key={form.key('phone')}
                                {...form.getInputProps('phone')}
                            />
                    </GridCol>

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="select"
                                label="Gender"
                                placeholder="Pick your Gender"
                                radius={35}
                                size='md'
                                data={genderData}
                                key={form.key('gender')}
                                {...form.getInputProps('gender')}
                            />
                    </GridCol>

                    {/* yyyy-mm-dd */}
                     <GridCol span={{base:12, md:6}}>
                            <CustomInput type="datepicker"
                                label="Date of Birth"
                                placeholder="Pick your Date of Birth"
                                valueFormat='YYYY MMMM DD'
                                dateParser={dateParser}
                                radius={35}
                                size='md'
                                key={form.key('birthDate')}
                                {...form.getInputProps('birthDate')}
                            />
                    </GridCol>

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="text"
                                label="Home Address"
                                radius={35}
                                size='md'
                                placeholder="Enter your Residential Address"
                                key={form.key('address')}
                                {...form.getInputProps('address')}
                            />
                    </GridCol>

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="text"
                                label="Occupation"
                                radius={35}
                                size='md'
                                placeholder="Enter your Work Occupation"
                                key={form.key('occupation')}
                                {...form.getInputProps('occupation')}
                            />
                    </GridCol>

                     <GridCol span={{base:12, md:6}}>
                            <CustomInput type="text"
                                label="Emergency contact name"
                                radius={35}
                                size='md'
                                placeholder="Enter your emergency contact name"
                                key={form.key('emergencyContactName')}
                                {...form.getInputProps('emergencyContactName')}
                            />
                    </GridCol>

                     <GridCol span={{base:12, md:6}}>
                             <CustomInput type="phone_no"
                                label="Emergency Contact Number"
                                placeholder="Enter your Emergency Contact Number"
                                className=' phone-no'
                                key={form.key('emergencyContactNumber')}
                                {...form.getInputProps('emergencyContactNumber')}
                            />
                    </GridCol>
                </Grid>
            </Stepper.Step>

            <Stepper.Step label="Second step" description="Medical Information">
                <Grid overflow='hidden'>
                  <GridCol span={{base:12, md:6}}>
                            <CustomInput type="select"
                                label="Blood Group"
                                placeholder="Select your Blood Group"
                                radius={35}
                                size='md'
                                data={bloodGroups}
                                key={form.key('bloodGroup')}
                                {...form.getInputProps('bloodGroup')}
                            />
                    </GridCol>

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="select"
                                label="Genotype"
                                placeholder="Select your Genotype"
                                radius={35}
                                size='md'
                                data={genotypes}
                                key={form.key('genotype')}
                                {...form.getInputProps('genotype')}
                            />
                    </GridCol>


                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="text"
                                label="insurance Provider"
                                radius={35}
                                size='md'
                                placeholder="Enter your insurance Provider"
                                key={form.key('insuranceProvider')}
                                {...form.getInputProps('insuranceProvider')}
                            />
                    </GridCol>

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="text"
                                label="Insurance Policy Number"
                                radius={35}
                                size='md'
                                placeholder="Enter your Insurance Policy Number"
                                key={form.key('insurancePolicyNumber')}
                                {...form.getInputProps('insurancePolicyNumber')}
                            />
                    </GridCol>

                    {/* allergies: & currentMedication */}

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="textarea" label="Allergies" size="md" placeholder='Enter any allegies you may have eg.Peanuts, Penicillin, Pollen'
                                key={form.key('allergies')}
                                {...form.getInputProps('allergies')}
                            />
                    </GridCol>

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="textarea" size="md" label="Current Medication" placeholder='Your medication Eg. Ibuprofen 200mg, Levothyroxine 50mcg'
                                key={form.key('currentMedication')}
                                {...form.getInputProps('currentMedication')}
                            />
                    </GridCol>

                    {/* familyMedicalHistory & pastMedicalHistory */}

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="textarea" label="Family Medical History" size="md" placeholder="Father has hypertension"
                                key={form.key('familyMedicalHistory')}
                                {...form.getInputProps('familyMedicalHistory')}
                            />
                    </GridCol>

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="textarea" size="md" label="Personal Past Medical History" placeholder='Your Past medical history Eg. Appendectomy in 2015, Asthma diagnosis in childhood'
                                key={form.key('pastMedicalHistory')}
                                {...form.getInputProps('pastMedicalHistory')}
                            />
                    </GridCol>

                   
                </Grid>
            </Stepper.Step>

            <Stepper.Step label="Final step" description="Identification and Verfication">
              {/* identificationType, identificationNumber, identificationDocument, profilePicture, privacyConsent: false */}
            <Grid overflow='hidden'>
                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="select"
                                label="Identification Type"
                                placeholder="Select your type of Identification"
                                radius={35}
                                size='md'
                                data={IdentificationTypes}
                                key={form.key('identificationType')}
                                {...form.getInputProps('identificationType')}
                            />
                    </GridCol>

                    <GridCol span={{base:12, md:6}}>
                            <CustomInput type="text"
                                label="Identification Number"
                                radius={35}
                                size='md'
                                placeholder="Enter your Identification Number"
                                key={form.key('identificationNumber')}
                                {...form.getInputProps('identificationNumber')}
                            />
                    </GridCol>

                    <GridCol className=' items-end flex justify-center' span={{base:12, md:6}}>
                           <CustomInput label='Upload Profile Picture' type="fileInput" allowPicture file={file} setFile={setFile}/>
                    </GridCol>

                     <GridCol span={{base:12, md:6}}>
                           <CustomInput className=' text-graytext'  radius={"xl"} label='I agree to Privacy Policy'
                            key={form.key('privacyConsent')} {...form.getInputProps('privacyConsent')} size='md' type='checkbox'/>
                    </GridCol>

                    <GridCol span={{base:12}}>
                           <DropzoneWrapper maxSize={2 * 1024 * 1024} acceptFiles={['application/pdf', 'image/jpeg', 'image/png']} 
                           maxFiles={1} file={documentFile}
                           title="Drag or Upload your Identification Document"
                           subtitle="Attach an identification document. A file should not exceed 2mb"
                          handleDrop={setDocumentFile}/>
                    </GridCol>
                </Grid>
            </Stepper.Step>
            <Stepper.Completed>
              <Box className=' flex flex-col items-center justify-center space-y-5'>
                <Text c="m-orange" fw="700" size="40px">Completed!:</Text>
                  <IconRosetteDiscountCheckFilled className=' text-primary' width={150} height={150}/>   
              </Box>
            
            </Stepper.Completed>
        </Stepper>

        <Group justify="flex-end" mt="xl">
            {active !== 0 && (
            <Button variant="default" onClick={prevStep}>
                Back
            </Button>
            )}
            {active !== 3 && <Button onClick={nextStep}>Next step</Button>}
            {active === 3 && <Button loading={form.submitting} type="submit">Submit</Button>}
        </Group>
      </Box>
      
    </Paper>
  )
}

export default CreateProfileForm