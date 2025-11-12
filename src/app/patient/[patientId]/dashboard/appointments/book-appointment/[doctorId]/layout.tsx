import DoctorBookingProfileStatus from "@/components/boxes/DoctorBookingProfileStatus";
import CustomHeaders from "@/components/headers/CustomHeaders";
import { getDoctorDetailsOnBooking } from "@/lib/actions/patientGetActions";
import { Grid, GridCol, Paper } from "@mantine/core";
import Image from "next/image";
import React, { Suspense } from "react";

const Bookinglayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ doctorId: string }>;
}) => {
  const { doctorId } = await params;
  const response = await getDoctorDetailsOnBooking(doctorId);
  return (
    <Paper p={20} className=" min-h-screen" shadow="md" radius={"md"}>
      <CustomHeaders />
      <Grid gutter={{ base: 20, md: 30 }}>
        <GridCol span={{ base: 12, md: 8 }}>{children}</GridCol>
        <GridCol span={{ base: 12, md: 4 }}>
          <section className=" space-y-3">
            <Image
              width={370}
              height={407}
              className=" object-cover rounded-xl w-full h-[407px]"
              src={response?.profilePicture}
              alt="doctor-profile-picture"
            />
            <Suspense>
              <DoctorBookingProfileStatus
                count={response?.ratingCount}
                rating={response?.avgRating}
                fullname={response?.fullname}
                doctorId={doctorId}
                specialization={response?.specialization}
                workingDays={response?.doctorAvailability?.workSchedule}
              />
            </Suspense>
          </section>
        </GridCol>
      </Grid>
    </Paper>
  );
};

export default Bookinglayout;
