import Authlayout from "@/components/layout/Authlayout";
import MedReserveLogo from "@/components/atoms/logo/MedReserveLogo";
import { Center, Grid, GridCol } from "@mantine/core";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Authlayout>
      <Grid overflow="hidden" className=" h-full">
        <GridCol
          bg="m-background"
          className=" relative px-[20px]  md:px-[64px] py-[38px] h-screen w-full"
          span={{ base: 12, md: 6 }}
        >
          <div>
            <MedReserveLogo />
          </div>
          <Center className="mt-20">{children}</Center>
        </GridCol>
      </Grid>
    </Authlayout>
  );
}
