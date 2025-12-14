"use client";
import { FloatingIndicator, Tabs } from "@mantine/core";
import { TabsDataType } from "@/types";
import classes from '@/styles/Demo.module.css'
import { useState } from "react";

type Props = {
  tabs: TabsDataType[];
  tabsGrow?: boolean;
  justify?: "center" | "flex-start" | "flex-end" | "space-between";
  setControlRef: (val: string) => (node: HTMLButtonElement) => void;
  value: string;
  controlsRefs: Record<string, HTMLButtonElement | null>;
};
function MedReverseTabsControlled({ tabs, tabsGrow = false, justify="flex-start", setControlRef, value, controlsRefs}: Props) {
const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);

  return (
    <Tabs.List
      grow={tabsGrow}
      justify={justify}
      ref={setRootRef}
      className={classes.list}
    >
      {tabs?.map((item, index) => (
        <Tabs.Tab
          key={index}
          className={classes.tab}
          value={item?.value}
          ref={setControlRef(item?.value)}
        >
            {item?.label}
        </Tabs.Tab>
      ))}
      <FloatingIndicator
        target={value ? controlsRefs[value] : null}
        parent={rootRef}
        className={classes.indicator}
      />
    </Tabs.List>
  );
}

export default MedReverseTabsControlled;
