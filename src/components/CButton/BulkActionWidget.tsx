"use client";
import React from "react";
import CustomModal from "../modals/CustomModal";
import { Badge, Button, Group, Paper } from "@mantine/core";

type BulkActionWidgetProps = {
  opened: boolean;
  onClose: () => void;
  docsCount?: number;
  confirmBtn1: React.ReactNode;
  confirmBtn2?: React.ReactNode;
};

const BulkActionWidget = ({
  opened,
  onClose,
  docsCount,
  confirmBtn1,
  confirmBtn2,
}: BulkActionWidgetProps) => {
  return (
    <CustomModal
      closeOnClickOutside={false}
      opened={opened}
      radius={"md"}
      c="m-blue"
      onClose={onClose}
      withCloseButton={false}
      withOverlay={false}
      yOffset={"45%"}
      zIndex={1000}
      shadow="xl"
    >
      <Paper>
        <Group justify="space-between">
          <div className=" flex items-center gap-x-1">
            <Badge radius="sm" size="md">
              {docsCount}
            </Badge>
            <span className=" text-md">Items Selected</span>
          </div>
          <div className=" flex gap-x-2 items-center">
            <Button onClick={onClose}>Cancel</Button>
            {confirmBtn2 && confirmBtn2}
            {confirmBtn1}
          </div>
        </Group>
      </Paper>
    </CustomModal>
  );
};

export default BulkActionWidget;
