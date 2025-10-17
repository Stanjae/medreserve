"use client";
import { IconAlertCircle } from "@tabler/icons-react";
import React, { useState } from "react";
import CustomInput from "../inputs/CustomInput";
import { Button, Group } from "@mantine/core";

type Props = {
  label: string;
  description: string;
  onClose: () => void;
  onSubmit: (data: string) => void;
};

const CancelAppointmentCard = ({ label, description, onClose, onSubmit }: Props) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    onSubmit(text);
  };
  return (
    <div className="bg-white rounded-lg shadow-xl  w-full p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconAlertCircle size={32} className="text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{label}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="space-y-4">
        <CustomInput
          type="textarea"
          size="md"
          placeholder="Reason for cancellation"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          rows={3}
        />
        <Group grow>
          <Button onClick={onClose} color="m-blue">
            Keep Appointment
          </Button>
          <Button onClick={handleSubmit} color="red">Yes, Cancel</Button>
        </Group>
      </div>
    </div>
  );
};

export default CancelAppointmentCard;
