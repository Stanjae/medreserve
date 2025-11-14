/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, Divider, Group, Text } from "@mantine/core";
import CustomModal from "./CustomModal";

type Props = {
  fn?: () => Promise<any>;
  modalContent: string;
  modalHeader: string;
  btnText: string;
    loading?: boolean;
    opened: boolean;
    close: () => void;
};

const ConfirmationModal = ({
  modalHeader,
    fn,
  opened,
  modalContent,
    loading,
    btnText,
    close
}: Props) => {
      const handleConfirm = async(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        e.stopPropagation();
        if (fn) await fn();
        close();
      };
  return (
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
      <Divider my="md" color="m-cyan" />
      <Group mt="xl" justify="flex-end">
        <Button
          variant="outline"
          color="m-blue"
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
        >
          Not Now
        </Button>
        <Button loading={loading} size="md" color="red" onClick={handleConfirm}>
          {btnText}
        </Button>
      </Group>
    </CustomModal>
  );
};

export default ConfirmationModal;
