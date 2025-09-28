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
  loading,
}: {
  fn?: () => Promise<{
    code: number;
    status: string;
    message: string;
  }> | void;
  modalContent: string;
  btnProps?: ButtonProps;
  modalHeader: string;
    btnText: string;
    loading?: boolean
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleConfirm = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (fn) fn();
    close();
  };
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
        closeOnClickOutside={false}
        centered
      >
        <Text c="m-gray" size="lg">
          {modalContent}
        </Text>
        <Group mt="xl" justify="flex-end">
          <Button variant="outline" color="m-blue" size="md" onClick={(e) => { e.stopPropagation(); close() }}>
            Not Now
          </Button>
          <Button loading={loading} size="md" color="red" onClick={handleConfirm}>
            Confirm
          </Button>
        </Group>
      </CustomModal>
      <Button {...btnProps} onClick={(e) => { e.stopPropagation(); open() }}>
        {btnText}
      </Button>
    </>
  );
};

export default CustomCancelBtn;
