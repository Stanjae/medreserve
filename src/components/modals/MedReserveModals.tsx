"use client";
import { Modal, ModalProps } from "@mantine/core";

const MedReserveModals = (
  props: ModalProps & { children: React.ReactNode }
) => {
  const { children, title, ...rest } = props;
  return (
    <Modal.Root {...rest}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default MedReserveModals;
