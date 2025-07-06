import CreateDoctorProfileForm from "@/components/forms/CreateDoctorProfileForm";
import { stateOptions } from "@/lib/queryclient/query-actions";
import { getQueryClient } from "@/lib/queryclient/query-config";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Page = () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(stateOptions);
  return (
    <main className="h-screen flex justify-center items-center create-profile-bg">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CreateDoctorProfileForm />
      </HydrationBoundary>
    </main>
  );
};

export default Page;
