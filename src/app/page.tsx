"use client";
import MainNavbar from "@/components/navbar/MainNavbar";
import NavContent from "@/components/navbar/NavContent";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  List,
  Paper,
  Text,
} from "@mantine/core";
import Image from "next/image";
import React from "react";
import FirstDoc from "../../public/firstDoc.png";
import Puzzle from "../../public/puzzle-1.png";
import MotherChild from '../../public/mother_kid.png'
import Link from "next/link";
import {
  IconActivityHeartbeat,
  IconChevronCompactRight,
  IconClock,
  IconFlipHorizontal,
} from "@tabler/icons-react";
import {
  conditionData,
  onlinePrograms,
  pricingPlansData,
} from "@/lib/api/mockData";
import Footer from "@/components/organisms/footer/Footer";
import { CAffix } from "@/components/affix/CAffix";
import { useScreenResolution } from "@/hooks/useScreenResolution";

const Page = () => {
  const resolution = useScreenResolution()
  return (
    <main>
      {/* hero section */}
      <CAffix />
      <MainNavbar />
      <section className=" overflow-hidden w-full hero-image bg-lightcyan min-h-screen px-6 md:px-0">
        <NavContent py="30" bg="" />

        <Box
          className="md:max-w-[calc(100%-316px)] md:mt-[182px] md:mb-[215px]"
          mx="auto"
        >
          <Grid justify="center" align="center" overflow="hidden">
            <Grid.Col className=" space-y-5" span={{ base: 12, md: 6 }}>
              <h1 className=" mb-6 -ml-0.5 font-extrabold md:leading-[100px] leading-[60px] text-4xl md:text-6xl lg:text-[80px] text-secondary text-center md:text-left">
                Doctors who
                <br /> treat with care
              </h1>

              <Text size="xl" c="m-gray" mb="40px" className=" leading-[34px] md:text-left text-center">
                Our skilled doctors have tremendous experience with wide range
                of diseases to serve the needs of our patients
              </Text>

              <Group className=" md:justify-start justify-center">
                <Button
                  component={Link}
                  href={"/auth/login"}
                  color="m-orange"
                  size="xl"
                  variant="filled"
                  className=" hover:bg-secondary duration-500  font-extrabold rounded-full w-full md:w-auto"
                >
                  Book an Appointment
                </Button>

                <Button
                  component={Link}
                  href={"/help"}
                  color="m-gray"
                  size="xl"
                  variant="white"
                  className=" hover:text-white hover:bg-primary duration-500  font-extrabold rounded-full w-full md:w-auto"
                >
                  Learn More
                </Button>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Image
                width={950}
                height={950}
                className=" md:hidden w-full object-cover"
                alt=""
                src={FirstDoc}
              />
            </Grid.Col>
          </Grid>
        </Box>
      </section>

      <section className=" bg-secondary py-[95px] relative px-6 md:px-0">
        <Image
          width={500}
          height={500}
          className=" absolute md:right-[180px] right-[5%] -top-28  w-[160px] h-[217px] block"
          alt=""
          src={Puzzle}
        />

        <Box className="md:max-w-[calc(100%-316px)] mx-auto">
          <Grid
            gutter={{ base:60, xs: "md", md: "xl", xl: 130 }}
            overflow="hidden"
          >
            <Grid.Col className=" space-y-5" span={{ base: 12, md: 5 }}>
              <div className=" flex items-center gap-3">
                <IconClock className=" text-primary size-8" />
                <h4 className=" font-extrabold leading-[28px] text-2xl md:text-2xl lg:text-3xl text-background">
                  Working Hours
                </h4>
              </div>

              <Text fz="18" c="m-gray.4" mb="40px" className=" leading-[34px]">
                Please check below for our working hours throughout the week
                excluding national holidays.
              </Text>

              <>
                <Group justify="space-between">
                  <Text
                    fz="18"
                    fw="600"
                    lts="0.36px"
                    lh="30px"
                    c="m-background"
                  >
                    Monday - Friday
                  </Text>

                  <Text
                    fz="18"
                    fw="600"
                    lts="0.36px"
                    lh="30px"
                    c="m-background"
                  >
                    9am - 10pm
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text
                    fz="18"
                    fw="600"
                    lts="0.36px"
                    lh="30px"
                    c="m-background"
                  >
                    Saturday - Sunday
                  </Text>

                  <Text
                    fz="18"
                    fw="600"
                    lts="0.36px"
                    lh="30px"
                    c="m-background"
                  >
                    9am - 6pm
                  </Text>
                </Group>
              </>
            </Grid.Col>

            <Grid.Col className=" space-y-5" span={{ base: 12, md: 6 }}>
              <div className=" flex items-center gap-3">
                <IconActivityHeartbeat className=" text-primary size-8" />
                <h4 className=" font-extrabold leading-[28px] text-2xl md:text-2xl lg:text-3xl text-background">
                  Doctor Availability
                </h4>
              </div>

              <Text fz="18" c="m-gray.4" mb="40px" className=" leading-[34px]">
                Our doctors are available most of the week and if not you can
                always book appointment with other available doctors on our
                panel of expert doctors.
              </Text>

              <div>
                <Button
                  component={Link}
                  href={"/our-doctors"}
                  color="m-orange"
                  size={resolution.isMobile ? "lg" : "md"}
                  variant="filled"
                  className=" capitalize hover:bg-background hover:text-graytext duration-500  font-extrabold rounded-full w-full md:w-auto"
                >
                  Meet our Doctors
                </Button>
              </div>
            </Grid.Col>
          </Grid>
        </Box>
      </section>

      <section className=" bg-background py-[132px] relative">
        <Box className="md:max-w-[calc(100%-316px)]" mx="auto">
          <h1 className=" mb-6 -ml-0.5 tracking-tighter font-extrabold text-center md:leading-[80px] text-2xl md:text-4xl lg:text-6xl text-secondary">
            Quality care for you and
            <br /> the ones you love.
          </h1>
          <Grid className=" mt-12 px-6" gutter={{ base: 30 }} overflow="hidden">
            {conditionData.map((item, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 4 }}>
                <Paper bg="m-cyan.0" shadow="xs" radius="lg">
                  <Center px={40} py={35}>
                    <Flex align={"center"} gap={17} justify={"center"}>
                      <div className=" bg-background p-5 rounded-full text-primary flex justify-center items-center">
                        {item.icon}
                      </div>
                      <h4 className=" text-secondary text-2xl font-extrabold leading-[32px]">
                        {item.title}
                      </h4>
                    </Flex>
                  </Center>
                  <Box
                    py={41}
                    px={61}
                    className="bg-background border-2 border-cyan-300 rounded-3xl"
                  >
                    <List
                      spacing="xs"
                      size="sm"
                      center
                      c="m-gray"
                      icon={<IconFlipHorizontal size={16} />}
                    >
                      {item.list.map((sub, i) => (
                        <List.Item
                          className=" capitalize duration-500 text-[18px] font-medium leading-[30px] hover:font-bold"
                          key={i}
                        >
                          {sub}
                        </List.Item>
                      ))}
                    </List>
                    <Button
                      className=" mt-8"
                      size="md"
                      rightSection={<IconChevronCompactRight />}
                      component={Link}
                      href={item.href}
                      variant="white"
                    >
                      Learm More
                    </Button>
                  </Box>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      </section>

      <section className=" overflow-hidden w-full banner1 bg-lightcyan px-6 md:px-0">
        <Box
          className="md:max-w-[calc(100%-316px)] mt-[60px] md:mt-[132px] md:mb-[150px]"
          mx="auto"
        >
          <Grid justify="center" align="center" overflow="hidden" >
            <Grid.Col className=" space-y-5" span={{ base: 12, md: 7 }}>
              <h1 className=" mb-6 -ml-0.5 font-extrabold leading-[40px] md:leading-[80px] text-2xl md:text-4xl lg:text-6xl text-secondary">
                We provide quality care
                <br /> that treats everyone.
              </h1>

              <Text
                size="xl"
                mb="40px"
                className=" leading-[34px] md:text-gray-50 text-graytext"
              >
                Our skilled doctors have tremendous experience with wide range
                of diseases to serve the needs of our patients
              </Text>

              <Grid className=" mt-12" gutter={{ base: 30 }} overflow="hidden">
                {pricingPlansData.map((item, index) => (
                  <Grid.Col key={index} span={{ base: 12, md: 4 }}>
                    <Paper bg="m-background" shadow="xs" radius="lg">
                      <Center px={40} py={35}>
                        <div className={" flex md:flex-col flex-row items-center gap-4"}>
                          <div className=" bg-cyan-100 p-5 rounded-full text-primary flex justify-center items-center">
                            {item.icon}
                          </div>
                          <h4 className=" text-center text-secondary leading-[28px] text-xl font-bold ">
                            {item.title}
                          </h4>
                        </div>
                      </Center>
                    </Paper>
                  </Grid.Col>
                ))}
              </Grid>

              <Group mt={50}>
                <Button
                  component={Link}
                  href={"/auth/login"}
                  color="m-orange"
                  size="xl"
                  variant="filled"
                  className=" hover:bg-secondary duration-500  font-extrabold rounded-full md:w-auto w-full"
                >
                  Book an Appointment
                </Button>
              </Group>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Image
                width={500}
                height={500}
                className=" md:hidden w-full mt-[100px] block"
                alt=""
                src={MotherChild}
              />
            </Grid.Col>
          </Grid>
        </Box>
      </section>

      <section className=" bg-background py-[132px] relative">
        <Box className="md:max-w-[calc(100%-316px)] px-6 md:px-0" mx="auto">
          <h1 className=" mb-6 -ml-0.5 tracking-tighter font-extrabold text-center md:leading-[80px] leading-[40px] text-2xl md:text-4xl lg:text-6xl text-secondary">
            How does our online <br /> program works?
          </h1>
          <Grid className=" mt-12" gutter={{ base: 30 }} overflow="hidden">
            {onlinePrograms.map((item, index) => (
              <Grid.Col
                key={index}
                className=" space-y-2.5"
                span={{ base: 12, md: 4 }}
              >
                <div className="w-full relative">
                  <Image
                    width={500}
                    height={500}
                    className="h-[461px] mx-auto z-10  w-[298px]"
                    alt=""
                    src={item.image}
                  />
                  <div className=" -mt-[calc(327px+0px)] rounded-4xl bg-secondary -z-50 max-w-[370px] h-[327px]" />
                </div>

                <Box
                  py={41}
                  px={61}
                  bg="m-cyan.1"
                  className=" space-y-4 rounded-4xl"
                >
                  <h4 className=" capitalize font-extrabold text-2xl text-secondary">
                    {item.title}
                  </h4>
                  <Text c="m-gray" fw="500" fz={"18"} lh={"30px"}>
                    {item.description}
                  </Text>
                  <Button
                    size="md"
                    rightSection={<IconChevronCompactRight />}
                    component={Link}
                    href={item.href}
                    variant="transparent"
                  >
                    Learm More
                  </Button>
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      </section>

      <Footer />
    </main>
  );
};

export default Page;
