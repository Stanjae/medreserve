'use client'
import { signOut } from '@/lib/actions/actions';
import { useMedStore } from '@/providers/med-provider';
import { parseResponse } from '@/utils/utilsFn';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const useLogout = () => {
    const router = useRouter();
    const {clearAuthCredentials} = useMedStore((state) => state)
    const logoutPatient = async() => {
            const response = await signOut();
            if(response.code !== 200){
               toast.error(parseResponse(response?.message));
            }else{
                toast.success(response?.message);
                clearAuthCredentials();
                router.push(`/auth/login`);
            }
        }
  return {logoutPatient}
}

export default useLogout