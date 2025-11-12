"use client";
import CustomModal from "@/components/modals/CustomModal";
import { Button, ButtonProps, Group } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import React from "react";

type Props = {
  opened: boolean;
  onClose?: () => void;
  content: React.ReactNode;
  title: string;
  description: string;
  buttons: {
    label: string;
    onClick: () => void;
    variant: ButtonProps["variant"];
    color: string;
  }[];
};

const FeedbackModal = ({
  opened,
  onClose,
  content,
  title,
  description,
  buttons,
}: Props) => {
  const handleClose = () => {
    if(onClose)onClose()
  };
  return (
    <CustomModal
      opened={opened}
      closeOnClickOutside={false}
      onClose={handleClose}
      size="lg"
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      centered
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white  p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <IconCircleCheck className="text-green-600" size={48} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
           {title}
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            {description}
          </p>

          <section>{content}</section>
          <Group justify="center">
            {buttons.map((button, idx) => (
              <Button
                key={idx}
                variant={button.variant}
                color={button.color}
                onClick={button.onClick}
                size="md"
              >
                {button.label}
              </Button>
            ))}
          </Group>
        </div>
      </div>
    </CustomModal>
  );
};

export default FeedbackModal;
