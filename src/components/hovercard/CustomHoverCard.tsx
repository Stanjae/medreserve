"use client";
import {
  HoverCard,
  Group,
  HoverCardProps,
} from "@mantine/core";

export function CustomHoverCard({
  children,
  trigger,
  props,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
  props?: HoverCardProps;
}) {
  return (
    <Group justify="center">
      <HoverCard
        {...props}
      >
        <HoverCard.Target>{trigger}</HoverCard.Target>
        <HoverCard.Dropdown>{children}</HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
}
