"use client";
import { UseModalsStackReturnType } from "@/types";
import { Button, Group, Modal } from "@mantine/core";

type Props = {
  stack: UseModalsStackReturnType<string>;
  modalItems: {
    rregisterName: string;
    modalTitle: string;
    modalContent: string;
    confirmBtnText: string;
    confirmBtnAction: () => void;
  }[];
};

export function CustomModalStack({ stack, modalItems }: Props) {
  return (
    <>
      <Modal.Stack>
        {modalItems.map((item, index) => (
          <Modal
            key={index}
            {...stack.register(item.rregisterName)}
            title={item.modalTitle}
          >
            {item.modalContent}
            <Group mt="lg" justify="flex-end">
              <Button onClick={stack.closeAll} variant="default">
                Cancel
              </Button>
              <Button onClick={item.confirmBtnAction} color="red">
                {item.confirmBtnText}
              </Button>
            </Group>
          </Modal>
        ))}
      </Modal.Stack>
    </>
  );
}
