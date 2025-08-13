"use client";
import { GetDoctorsMasonryResponse } from "@/types/actions.types";
import { parseResponse } from "@/utils/utilsFn";
import { ActionIcon, Collapse, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCirclePlus, IconLink } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DoctorMasonryCard = ({ item }: { item: GetDoctorsMasonryResponse }) => {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <div className=" space-y-4 mason-card transition-all duration-700 ease-in-out">
      <Link href={`/our-doctors/${item.id}`} className=" relative block">
        <Image
          className=" rounded-lg hover:scale-105  w-full transition-all duration-700 ease-in-out"
          src={item.profilePicture}
          alt={item.fullname}
          width={470}
          height={407}
        />
        <div className=" absolute rounded-lg top-0 left-0 h-full  bg-secondary/50 hidden items-center justify-center w-full mason-overlay opacity-0  transition-all duration-700 ease-in-out">
          <span className=" p-5 rounded-full border border-white">
            <IconLink stroke={1.95} color="white" size={20} />
          </span>
        </div>
      </Link>

      <section className=" bg-[#EBF6FA] rounded-[30px] py-[42px] px-[40px]">
        <Text fw={800} size="xl" lh="30px" c="m-blue">
          Dr. {item?.fullname}
        </Text>
        <Text
          fw={500}
          fz="18px"
          lh="30px"
          c="m-gray"
          tt="capitalize"
          lts="-0.36px"
        >
          {parseResponse(item?.specialization)}
        </Text>
        <Collapse in={opened}>
          <Text
            fw={500}
            mt={"15px"}
            fz="18px"
            lh="30px"
            c="m-gray"
            lts="0.36px"
          >
            {item?.bio}
          </Text>
        </Collapse>
        <Group justify="end">
          <ActionIcon
            onClick={toggle}
            variant="filled"
            color="cyan"
            aria-label="Expand"
            radius={"xl"}
            size="sm"
          >
            <IconCirclePlus
              style={{ width: "70%", height: "70%" }}
              stroke={1.95}
            />
          </ActionIcon>
        </Group>
      </section>
    </div>
  );
};

export default DoctorMasonryCard;
