import UserLoginForm from "@/components/forms/UserLoginForm";
import { Group, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";


const LoginPage = () => {
 

  return (
   <Paper shadow="md" className=" py-[46px] space-y-4  px-[70px] w-full max-w-[486px]">
           <h4 className=' text-2xl font-extrabold leading-[30px] mt-[3px] mb-[20px] text-center text-secondary'>Sign In</h4>
           <UserLoginForm/>
           <Stack>
            <Group justify="center">
              <Text c="m-gray">Forgot Password</Text>
              <Link className=' text-primary no-underline' href={'/auth/forgot-password'}>Click Here</Link>
            </Group>
            <Group justify="center">
              <Text c="m-gray">Don&apos;t have an account?</Text>
              <Link className=' text-primary no-underline' href={'/auth/signup'}>Create One</Link>
            </Group>
          </Stack>
    </Paper>
  );
};

export default LoginPage;
