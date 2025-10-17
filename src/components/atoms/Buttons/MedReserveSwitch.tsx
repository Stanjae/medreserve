"use client";
import { useState } from "react";
import { Switch } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

type Props = {
  didPatientSeeDoctor: boolean;
  label: string;
  handleChacked: (e: boolean) => Promise<void>;
  disabled?: boolean;
};

function MedReserveSwitch({ didPatientSeeDoctor, label, handleChacked, disabled=false }: Props) {
  const [checked, setChecked] = useState(didPatientSeeDoctor);

  const handleCheckedAction = async (e: boolean) => {
    setChecked(e);
    await handleChacked(e);
  };

  return (
    <Switch
      checked={checked}
      disabled={disabled}
      onChange={(event) => handleCheckedAction(event.currentTarget.checked)}
      color="teal"
      size="md"
      label={label}
      thumbIcon={
        checked ? (
          <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
        ) : (
          <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
        )
      }
    />
  );
}
export default MedReserveSwitch;
