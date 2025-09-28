"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Tabs } from "@mantine/core";

type Props = {
  tabs: {
    label: string;
    value: string;
    count: number;
    status: "unread" | "read";
  }[];
  tabsGrow?: boolean;
  justify?: "center" | "flex-start" | "flex-end" | "space-between";
  tabJustify?: "justify-center" | "flex-start" | "flex-end" | "space-between";
  defaultActiveTab?: string;
};
function MedReverseTabs({ tabs, tabsGrow = false, justify="flex-start", tabJustify="flex-start", defaultActiveTab }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Tabs
      value={searchParams.get("activeTab") ?? defaultActiveTab}
      onChange={(value) => router.push(`?activeTab=${value}`)}
      className="mb-8"
    >
      <Tabs.List grow={tabsGrow} justify={justify}>
        {tabs?.map((item, index) => (
          <Tabs.Tab 
            key={index}
            styles={{
              tab: {
                borderBottomWidth: "3px",
                padding: "10px 30px",
                backgroundColor:
                  searchParams.get("activeTab") === item?.value
                    ? "var(--mantine-color-m-gray-0)"
                    : "transparent",
              },
              tabLabel: {
                /*  color: "var(--mantine-color-m-blue-6)", */
                fontSize: "16px",
                fontWeight: "600",
              },
            }}
            value={item?.value}
          >
            <div className={`flex items-center gap-2 ${tabJustify}`}>
              {item?.label}{" "}
              {item.count == 0 ? null : (
                <Badge
                  size="sm"
                  color={item?.status === "unread" ? "red" : "gray"}
                  circle
                >
                  {item?.count}
                </Badge>
              )}
            </div>
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}

export default MedReverseTabs;
