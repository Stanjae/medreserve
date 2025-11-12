

export type EmailMethodTypes = 'POST' | 'GET' | 'PUT' | 'DELETE';

export type TEmailServiceBodyPayload = {
    email: string;
    pdfBase64: string;
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
    redirectUrl: string;
    username: string;
}