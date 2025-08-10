"use client";
import { Drawer, DrawerProps } from "@mantine/core";

type MedReverseDrawerProps = DrawerProps & {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

function MedReverseDrawer({
  opened,
  onClose,
  title,
  children,
  ...props
}: MedReverseDrawerProps) {
  return (
    <Drawer
      {...props}
      opened={opened}
      onClose={onClose}
      title={title}
      size="550px"
      styles={{
          header: { boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" },
          title: { fontSize: "22px", fontWeight: "bold" },
            body: { padding: "20px" },
        content: {
          backgroundColor: "var(--mantine-color-m-gray-0)",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {children}
    </Drawer>
  );
}

export default MedReverseDrawer;
