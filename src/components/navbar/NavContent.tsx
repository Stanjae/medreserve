'use client';
import { Avatar, Box, Group } from "@mantine/core";
import React from "react";
import TopNavLinks from "./TopNavLinks";
import { Button } from "@mantine/core";
import Link from "next/link";
import { MobileMainNavbar } from "./MobileMainNavbar";
import MedReserveLogo from "../logo/MedReserveLogo";
import { useMedStore } from "@/providers/med-provider";

const NavContent = ({ py, bg }: { bg: string; py: string }) => {
  const { credentials } = useMedStore((state) => state);
  return (
    <Box bg={bg} className=" overflow-hidden">
      <Box
        mx="auto"
        py={py}
        className="max-w-[calc(100%-128px)] items-center flex justify-between"
      >
        <MedReserveLogo />

        <TopNavLinks />
        {/* <ColorChanger/> */}
        <Group className="  hidden lg:flex">
          <Button
            component={Link}
            href={"/book-appointment"}
            color="m-blue"
            size="md"
            variant="filled"
            className=" hover:bg-primary duration-500  font-extrabold rounded-full"
          >
            Book an Appointment
          </Button>

          {!credentials?.userId ? (
            <Button
              component={Link}
              href={"/auth/login"}
              color="m-orange"
              size="md"
              variant="filled"
              className=" hover:bg-secondary duration-500  font-extrabold rounded-full"
            >
              Sign-in
            </Button>
          ) : (
            <Link
              href={`/${credentials?.role}/${credentials?.userId}/dashboard`}
            >
              <Avatar size="md" alt="it's me">
                {credentials?.username?.slice(0, 2)}
              </Avatar>
            </Link>
          )}
        </Group>

        <MobileMainNavbar />
      </Box>
    </Box>
  );
};

export default NavContent;
