"use client";
import { pageHeadersLibrary} from "@/constants";
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
  
const fixedHeader = checkIfValidID(newheader as string) ? pageHeadersLibrary[prevParent as keyof typeof pageHeadersLibrary] : newheader as string
  return (
    <Text fw={800} c="m-blue" mb="13px" className=' md:text-left text-center capitalize text-[45px] md:text-[60px] md:leading-[80px] leading-[50px]'>
      {fixedHeader}
    </Text>
  );
};

export default PageHeaders;
