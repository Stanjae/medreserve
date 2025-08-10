"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Tabs } from "@mantine/core";

type Props = {
  tabs: {
    label: string;
    value: string;
    count: number;
  }[];
};
function MedReverseTabs({ tabs }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Tabs
      value={searchParams.get("activeTab") ?? 'upcoming'}
          onChange={(value) => router.push(`?activeTab=${value}`)}
          className="mb-8"
    >
      <Tabs.List>
        {tabs?.map((item, index) => (
          <Tabs.Tab
            key={index}
                styles={{
                tab:{borderBottomWidth:"3px", padding:"10px 30px",  backgroundColor:searchParams.get("activeTab") === item?.value ? "var(--mantine-color-m-gray-0)" :"transparent"} ,
              tabLabel: {
               /*  color: "var(--mantine-color-m-blue-6)", */
                fontSize: "17px",
                fontWeight: "600",
              },
            }}
            value={item?.value}
          >
            <div className="flex items-center gap-2">
              {item?.label}{" "}
              {item?.count > 0 && (
                <Badge size="sm" color="red" circle>
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
