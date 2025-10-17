"use client";
import { Anchor, Breadcrumbs } from "@mantine/core";
import { IconActivityHeartbeat } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import React from "react";

const MedReserveBreadCrumbs = () => {
  const pathname = usePathname();

  const newbreadCrumbs = pathname.split("/").map((slug, index, array) => {
    const href = "/" + array.slice(1, index + 1).join("/");
    return (
      <Anchor
        href={href}
        key={index}
        className={` ${href == pathname ? "text-primary" : "text-secondary"} text-sm font-bold leading-[17.5px] capitalize no-underline`}
      >
        {slug == "" ? "Home" : slug.replace("/", "")}
      </Anchor>
    );
  });
  return (
    <div
      className={
        " py-[13.4px]  px-[28px] rounded-[25px] bg-white w-auto inline-block"
      }
    >
      <Breadcrumbs separator={<IconActivityHeartbeat />} separatorMargin="md">
        {newbreadCrumbs}
      </Breadcrumbs>
    </div>
  );
};

export default MedReserveBreadCrumbs;
