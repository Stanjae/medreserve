"use client";
import { pageHeadersObject } from "@/constants";
import { checkIfValidID } from "@/utils/utilsFn";
import { Text } from "@mantine/core";
import { usePathname } from "next/navigation";

const PageHeaders = () => {
  const pathname = usePathname();
  const newheader = pathname
    .split("/")
    .at(pathname.split("/").length - 1)
    ?.replaceAll("-", " ");
  
  const prevParent = pathname.split("/").at(pathname.split("/").length - 2);
  
const fixedHeader = checkIfValidID(newheader as string) ? pageHeadersObject[prevParent as keyof typeof pageHeadersObject] : newheader as string
  return (
    <Text fz={"60px"} lh={"80px"}  fw={800} c="m-blue" mb="13px">
      {fixedHeader}
    </Text>
  );
};

export default PageHeaders;
