export type ClientRegistrationParams = {
    username: string,
    email: string, 
    password: string, 
    terms_and_conditions: boolean;
    medId?: string | null| undefined;
}


export type PatientLoginParams = {
    email: string, 
    password: string,
}

type Gender = "Male" | "Female" | "Other";

export type CreatePatientProfileParams =  {
    email: string;
    phone: string;
    fullname: string;
    userId?: string;
    birthDate: Date | string;
    gender?: Gender;
    address: string;
    occupation: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    bloodGroup: string;
    genotype: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    allergies: string | undefined;
    currentMedication: string | undefined;
    familyMedicalHistory: string | undefined;
    pastMedicalHistory: string | undefined;
    identificationType: string | undefined;
    identificationNumber: string | undefined;
    identificationDocument: FormData | string | undefined;
    profilePicture: FormData | string | undefined;
    privacyConsent: boolean;
};



