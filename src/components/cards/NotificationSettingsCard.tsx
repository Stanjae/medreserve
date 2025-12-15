"use client";
import { notificationSettingsData } from "@/constants";
import { Switch } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type NotificationSettingsCardProps = {
  prefs:
    | {
        [key: string]: string | null | undefined | boolean;
      }
    | undefined;
  onSubmit?: UseMutationResult<
    {
      code: number;
      status: string;
      message: string;
    },
    Error,
    {
      [key: string]: string | boolean | null | undefined;
    },
    unknown
  >;
};

const NotificationSettingsCard = ({
  prefs,
  onSubmit,
}: NotificationSettingsCardProps) => {
  const [settings, setSettings] = useState<
    | {
        [key: string]: string | null | undefined | boolean;
      }
    | undefined
  >(prefs);

  useEffect(() => {
    if (prefs) setSettings(prefs);
  }, [prefs]);

  const handleSettingToggle = async (key: string, value: boolean) => {
    try {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [key]: value,
      }));
      if (onSubmit) {
        await onSubmit.mutateAsync({ [key]: value });
      }
    } catch (error) {
      console.error("Error updating notification setting:", error);
      setSettings(prefs);
    }
  };
  const puzzleDecoration = (
    <svg
      className="absolute top-4 right-4 w-16 h-16 opacity-10"
      viewBox="0 0 100 100"
      fill="none"
    >
      <path
        d="M50 0C50 13.8071 61.1929 25 75 25H100V50C86.1929 50 75 61.1929 75 75V100H50C50 86.1929 38.8071 75 25 75H0V50C13.8071 50 25 38.8071 25 25V0H50Z"
        fill="#FF6B6B"
      />
    </svg>
  );
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 relative overflow-hidden">
      {puzzleDecoration}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
          <IconBell className="w-5 h-5 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
      </div>
      <div className="space-y-4">
        {notificationSettingsData.map(({ key, label, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div>
              <p className="font-medium text-gray-900">{label}</p>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
            <Switch
              size="lg"
              checked={settings?.[key] as boolean}
              onChange={(event) =>
                handleSettingToggle(key, event.currentTarget.checked)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettingsCard;
