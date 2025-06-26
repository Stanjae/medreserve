import { JSX } from "react";
import doctorsData from "../lib/api/data.json";

export const parseResponse = (response: string) => response.replace(/[_-]/g, ' ');

export const handleFileUpload =async(file:File)=>{
    const body = new FormData();
    body.append('file', file);
    try{
        const response = await fetch('/api/medreserve/upload', {method: 'POST', body,});
        const data = await response.json();
        return data?.fileUrl;
    }catch(err){
        console.log(err);
    }
};


export const handleNavLinks = (role: string, userId: string|undefined, navigation: { sub?:{label: string; href: string;}[],
    child:boolean, label: string; href: string; leftIcon: JSX.Element; }[]) => {
 return navigation.map((item) => ({...item, href: item.href == 'dashboard' ?
    `/${role}/${userId}/dashboard` :
    `/${role}/${userId}/dashboard/${item.href}`}));   
}

// Define the Doctor type
export interface Doctor {
  doctorId: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  designation: string;
  specialization: string;
  imageUrl: string;
}

// Define the API response type
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T | null | undefined;  // data can be Doctor or null if not found
}



export async function simulateFetchNin(search:string, delay: number):Promise<ApiResponse<Doctor | null>>{
    const nin = doctorsData.doctors.find((doc) => doc.doctorId == search)
    return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        message: "Doctors data fetched successfully",
        data: nin
      });
    }, delay);
  });
}