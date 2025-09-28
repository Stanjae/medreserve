import EditUserForm from '@/components/forms/EditUserForm'

const page =async  ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>; }) => {
  const userId = (await searchParams).userId;
  return (
    <div>
      <EditUserForm userId={userId}/>
    </div>
  )
}

export default page
