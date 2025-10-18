'use client';
import {
  Box,
  Divider,
  Grid,
  GridCol,
  Group,
  NavLink,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconBrandFacebookFilled,
  IconBrandX,
  IconBrandYoutubeFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import React from "react";
import MedLogo from "../../../public/medreserve_logo.png";
import { footerLinks } from "@/constants/urls";
import SubscribeForm from "../forms/SubscribeForm";

const Footer = () => {
  return (
    <Box bg="m-blue" py={147} pos={"relative"}>
      <section className="max-w-[calc(100%-316px)] mx-auto">
        <div className=" flex justify-between">
          <Image
            width={185}
            className=" w-[120px] h-[60px]"
            height={48}
            src={MedLogo}
            alt="logo"
          />

          <Group visibleFrom="xl" gap="50">
            <a className=" flex gap-1 items-center" href="https://x.com">
              <ThemeIcon color="m-gray" variant="transparent">
                <IconBrandX size={"20"} />
              </ThemeIcon>
              <Text fz={20} lh={"25px"} c="m-background">
                Twitter
              </Text>
            </a>
            <a className=" flex gap-1 items-center" href="https://facebook.com">
              <ThemeIcon color="m-gray" variant="transparent">
                <IconBrandFacebookFilled size={"20"} />
              </ThemeIcon>
              <Text fz={20} lh={"25px"} c="m-background">
                Facebook
              </Text>
            </a>
            <a className=" flex gap-1 items-center" href="https://facebook.com">
              <ThemeIcon color="m-gray" variant="transparent">
                <IconBrandYoutubeFilled size={"20"} />
              </ThemeIcon>
              <Text fz={20} lh={"25px"} c="m-background">
                Youtube
              </Text>
            </a>
          </Group>
        </div>
        <Divider color="m-cyan" my="xl" />
        <Grid className=" mt-12" gutter={{ xs: 30 }} overflow="hidden">
          {footerLinks.map((item, index) => (
            <GridCol
              key={index}
              className=" space-y-2.5"
              span={{ base: 12, md: 3 }}
            >
              <h6 className=" capitalize font-extrabold text-sm leading-[14px] text-cyan-200">
                {item.title}
              </h6>
              <Box py={41} className=" medFooterLinks space-y-4">
                {item.navLinks.length == 0 ? (
                  <SubscribeForm />
                ) : (
                  item.navLinks?.map((opera, i) => (
                    <NavLink
                      key={i}
                      className=" duration-500 customFooterlink hover:bg-transparent hover:underline-offset-4 hover:underline text-background"
                      href={opera.href}
                      label={opera.label}
                    />
                  ))
                )}
              </Box>
            </GridCol>
          ))}
        </Grid>

        <Text c="m-gray.3" className=" leading-[30px] text-[14px]">
          &copy; GFXPARTNER
        </Text>
      </section>
    </Box>
  );
};

export default Footer;
