"use client";
import { Pagination } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const CustomPagination = ({
  isPlaceholderData,
  total,
  dataHasMore,
}: {
  isPlaceholderData: boolean;
  total: number;
  dataHasMore: boolean;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

    console.log(isPlaceholderData, dataHasMore)
  const buildParams = (digit = 1) => {
    const params = new URLSearchParams();
    params.set("page", digit.toString());
    return params;
  };

  function handlePaginate(digit: number) {
      const params = buildParams(digit);
      router.replace(`${pathname}?${params.toString()}`);
  }
  return (
    <div>
      <Pagination
        size={"lg"}
        value={Number(searchParams.get("page")) || 1}
        /* getItemProps={(item) => {
            if (!isPlaceholderData && dataHasMore) {
            }
          }} */
        onChange={handlePaginate}
        total={Math.ceil(total / 5)}
      />
    </div>
  );
};

export default CustomPagination;
