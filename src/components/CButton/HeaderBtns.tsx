"use client";
import { useMedStore } from "@/providers/med-provider";
import { Button, MenuDropdown, MenuItem } from "@mantine/core";
import React from "react";
import { CDropdown } from "../dropdown/CDropdown";

const HeaderBtns = () => {
  const { pageButtons } = useMedStore((store) => store);

  if (pageButtons?.length === 0 || !pageButtons) return <div></div>;
  return (
    <div className=" flex  items-center gap-3">
      {pageButtons && pageButtons.map((btn, index) => {
          if (btn.type === "button") {
            const { label,...rest } = btn;
          return (
              <Button
              key={index}
              {...rest}
            >
              {label}
            </Button>
          );
        } else {
          return (
            <CDropdown
              key={index}
              props={{
                position: "bottom-end",
                width: 200,
                shadow: "md",
              }}
              trigger={<Button {...btn.triggerProps}>{btn.label}</Button>}
            >
              <MenuDropdown>
                {btn.items.map((item, index) => (
                  <MenuItem onClick={item.action} key={index} className=" text-[14px]">
                    {item.label}
                  </MenuItem>
                ))}
              </MenuDropdown>
            </CDropdown>
          );
        }
      })}
    </div>
  );
};

export default HeaderBtns;
