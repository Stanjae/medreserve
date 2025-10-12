"use client";
import { Card, Text } from "@mantine/core";
import { Icon, IconProps } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { ForwardRefExoticComponent,  RefAttributes } from "react";

type Props = {
  item: {
    title: string;
    description: string;
    href: string;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  };
  userId: string;
};

const DashboardShortCutCard = ({ item, userId }: Props) => {
  const router = useRouter();
  const IconComponent = item.icon;
  const navigateTo = () => router.push(item?.href?.replace("userId", userId));
  return (
    <Card
      className=" cursor-pointer hover:translate-y-[-2px] hover:shadow-primary transition-all duration-300"
      onClick={navigateTo}
      shadow="sm"
      p="40px"
      radius="md"
      withBorder
    >
      <Card.Section inheritPadding py="xs">
        <div className=" mx-auto size-20 bg-primary rounded-full flex items-center justify-center">
          <IconComponent size={40} stroke={1.5} color="#fff" />
        </div>
        <section className="text-center">
          <Text fw={700} size="lg">
            {item.title}
          </Text>
          <Text c="m-gray" size="md">
            {item.description}
          </Text>
        </section>
      </Card.Section>
    </Card>
  );
};

export default DashboardShortCutCard;
