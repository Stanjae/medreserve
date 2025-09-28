'use client'
import { Modal, ModalProps } from '@mantine/core';

const CustomModal = (props: ModalProps & { children: React.ReactNode }) => {
  const { children, ...rest } = props;
  return (
    <Modal {...rest} >
      {children}
    </Modal>
  );
}

export default CustomModal
