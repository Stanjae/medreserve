"use client";
import { AppointmentColumnsType } from "@/types/table";
import { Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconClockPlay } from "@tabler/icons-react";
import React from "react";
import RescheduleAppointment from "../forms/RescheduleAppointment";

const TableModals = ({ row }: { row: AppointmentColumnsType }) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Menu>
        <Menu.Item
          onClick={(event) => {
            event.stopPropagation(); // prevent menu close if needed
            open();
          }}
          leftSection={<IconClockPlay size={13} />}
        >
          Reschedule
        </Menu.Item>
      </Menu>
          <Modal size={"lg"} opened={opened} onClose={close}>
              <RescheduleAppointment row={row } />
      </Modal>
    </>
  );
};

export default TableModals;
