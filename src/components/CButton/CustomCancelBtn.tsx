"use client";
import React from "react";
import CustomModal from "../modals/CustomModal";
import { Button, ButtonProps, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const CustomCancelBtn = ({
  modalHeader,
  fn,
  modalContent,
  btnText,
  btnProps,
}: {
  fn?: () => Promise<{
    code: number;
    status: string;
    message: string;
  }>;
  modalContent: string;
  btnProps?: ButtonProps;
  modalHeader: string;
  btnText: string;
}) => {
    const [opened, { open, close }] = useDisclosure(false);
    
    const handleConfirm = () => {
        close();
        if (fn) fn();
    }
  return (
    <>
      <CustomModal
        styles={{
          title: { fontSize: "26px", fontWeight: "700" },
          content: { padding: "20px" },
        }}
        size="lg"
        opened={opened}
        title={modalHeader}
        onClose={close}
        centered
      >
        <Text c="m-gray" size="lg">
          {modalContent}
        </Text>
        <Group mt="xl" justify="flex-end">
          <Button variant="outline" color="m-blue" size="md" onClick={close}>
            Not Now
          </Button>
          <Button
            size="md"
            color="red"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Group>
      </CustomModal>
      <Button {...btnProps} onClick={open}>
        {btnText}
      </Button>
    </>
  );
};

export default CustomCancelBtn;
