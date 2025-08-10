'use client'
import { Card, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React, { JSX } from 'react'

type Props = {
    item: {
        title: string;
        description: string;
        href: string;
        icon: JSX.Element;
    };
    userId: string;
}

const DashboardShortCutCard = ({ item, userId }: Props) => {
    const router = useRouter();

    const navigateTo = ()=> router.push(item?.href?.replace('userId', userId));
  return (
      <Card className=" cursor-pointer hover:translate-y-[-2px] hover:shadow-primary transition-all duration-300" onClick={navigateTo} shadow="sm" p="40px" radius="md" withBorder>
          <Card.Section  inheritPadding py="xs">
              <div className=" mx-auto size-20 bg-primary rounded-full flex items-center justify-center">
                   {item.icon}
              </div>
              <section className="text-center">
                  <Text fw={700} size="lg">{item.title}</Text>
                  <Text c="m-gray" size="md">{item.description}</Text>
              </section>
        </Card.Section>
    </Card>
  )
}

export default DashboardShortCutCard