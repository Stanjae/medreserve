"use client";
import MedReverseTabsControlled from "@/components/atoms/tabs/MedReverseTabsControlled";
import NotificationSettingsCard from "@/components/cards/NotificationSettingsCard";
import PaymentsSettingCard from "@/components/cards/PaymentsSettingCard";
import MedReserveLoader from "@/components/loaders/MedReserveLoader";
import AccountCardForm from "@/components/molecules/cards/AccountCardForm";
import { RolesColor, SettingsTabsData } from "@/constants";
import { accountSettingsInitialValues } from "@/constants/formInitialValues";
import useGetCurrentAccount from "@/hooks/useGetCurrentAccount";
import useHandleCurrentAccount from "@/hooks/useHandleCurrentAccount";
import { accountSettingsSchema } from "@/lib/schema/zod";
import { Badge, LoadingOverlay, Tabs } from "@mantine/core";
import { useState } from "react";

const SettingsBox = () => {
  const [value, setValue] = useState<string | null>(SettingsTabsData[0]?.value);
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  const { data, isLoading } = useGetCurrentAccount();
  const {
    updateCurrentName,
    updateCurrentEmail,
    updateCurrentPhone,
      updateCurrentPassword,
    updateCurrentPrefs,
  } = useHandleCurrentAccount();

  const actions = {
    name: updateCurrentName,
    email: updateCurrentEmail,
    phone: updateCurrentPhone,
    password: updateCurrentPassword,
  };
  return (
    <div className="relative">
      <LoadingOverlay
        visible={isLoading}
        loaderProps={{ children: <MedReserveLoader /> }}
      />
      <Tabs variant="none" value={value} onChange={setValue}>
        <div className="flex items-center justify-between mb-6">
          <MedReverseTabsControlled
            tabs={SettingsTabsData}
            setControlRef={setControlRef}
            value={value as string}
            controlsRefs={controlsRefs}
          />
          <Badge size="lg" variant="dot" color={RolesColor[data?.role as keyof typeof RolesColor]}>{data?.role}</Badge>
        </div>

        <Tabs.Panel value={SettingsTabsData[0]?.value}>
          <div className="space-y-5">
            {accountSettingsInitialValues().map((section, index) => (
              <AccountCardForm
                section={section}
                key={index}
                currentAccount={data}
                schema={
                  accountSettingsSchema[
                    section.key as keyof typeof accountSettingsSchema
                  ]
                }
                onSubmit={actions[section.key as keyof typeof actions]}
              />
            ))}
          </div>
              </Tabs.Panel>
              
              <Tabs.Panel value={SettingsTabsData[1]?.value}>
                  <NotificationSettingsCard prefs={data?.prefs} onSubmit={updateCurrentPrefs}/>
              </Tabs.Panel>

              <Tabs.Panel value={SettingsTabsData[2]?.value}>
                  <PaymentsSettingCard/>
              </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default SettingsBox;
