import AllDoctorsMasonry from "@/components/organisms/lists/AllDoctorsMasonry";
import MedReserveLoader from "@/components/loaders/MedReserveLoader";
import { Text } from "@mantine/core";
import React, { Suspense } from "react";

const page = () => {
  return (
    <main className="p-1">
      <section className="p-1">
        <div className=" mx-auto max-w-[calc(100%-316px)]">
          <section className=" mt-[130px]">
            <Text
              c="m-blue"
              ta="center"
              fw={800}
              fz="60px"
              lh="80px"
              mb="30px"
              lts="-1.2px"
            >
              Meet our expert and
              <br /> qualified doctors.
            </Text>
          </section>
          <Suspense fallback={<MedReserveLoader />}>
            <AllDoctorsMasonry />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default page;
