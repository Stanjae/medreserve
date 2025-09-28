"use client";
import { Drawer, DrawerProps } from "@mantine/core";

type MedReverseDrawerProps = DrawerProps & {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  btnGroup?: React.ReactNode;
};

function MedReverseDrawerWithBtns({
  opened,
  onClose,
  title,
  children,
  btnGroup,
  ...props
}: MedReverseDrawerProps) {
  return (
    <>
      <Drawer.Root
        opened={opened}
        onClose={onClose}
        {...props}
        size={props.size ?? "550px"}
        styles={{
          header: { boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" },
          title: { fontSize: "20px", fontWeight: "bold" },
          body: { padding: "20px" },
          content: {
            backgroundColor: "var(--mantine-color-m-gray-0)",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title >{title}</Drawer.Title>
            <div className=" flex items-center gap-10">
              {btnGroup}
              <Drawer.CloseButton />
            </div>
          </Drawer.Header>
          <Drawer.Body>{children}</Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}

export default MedReverseDrawerWithBtns;
