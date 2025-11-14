"use client";
import { parseResponse } from "@/utils/utilsFn";
import { Avatar, Group, Rating, Stack, Text } from "@mantine/core";
import React from "react";
import { Reviews } from "../../../types/appwrite";

type Props = {
  doctorName: string;
  profilePicture: string;
  rating: Reviews[]
  specialization: string;
  bio: string;
};

const TableHoverDoctorCard = ({
  doctorName,
  profilePicture,
  rating,
  specialization,
  bio,
}: Props) => {
  const newRating =
    rating?.reduce((acc, val) => Number(acc) + Number(val.rating), 0) /
    rating?.length;
  return (
    <div>
      <Group>
        <Avatar src={profilePicture} radius="xl" />
        <Stack gap={5}>
          <Text size="md" fw={700} style={{ lineHeight: 1 }}>
            Dr. {doctorName}
          </Text>
          <Text
            c="dimmed"
            tt={"capitalize"}
            size="sm"
            fw={700}
            style={{ lineHeight: 1 }}
          >
            {specialization && parseResponse(specialization)}
          </Text>
        </Stack>
      </Group>
      <Text size="sm" mt="md">
        {bio}
      </Text>
      <Rating readOnly fractions={2} value={newRating} size={"sm"} />
    </div>
  );
};

export default TableHoverDoctorCard;
