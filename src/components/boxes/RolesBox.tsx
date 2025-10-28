"use client";
import useGetAllRoles from "@/hooks/admin/useGetAllRoles";
import usePageButtons from "@/hooks/usePageButtons";
import { checkPermission, parseResponse } from "@/utils/utilsFn";
import {
  Accordion,
  Button,
  Checkbox,
  Divider,
  Grid,
  GridCol,
  Group,
  Paper,
  Skeleton,
  Text,
  useModalsStack,
} from "@mantine/core";
import {
  IconChevronCompactRight,
  IconCircleCheckFilled,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import MedReverseDrawerWithBtns from "../drawers/MedReserveDrawerWithBtns";
import RolesForm from "../forms/RolesForm";
import { DefaultRoles, ModifiedRoles } from "../../../types/appwrite";
import useHandleRoles from "@/hooks/admin/useHandleRoles";
import CustomCancelBtn from "../CButton/CustomCancelBtn";
import { CustomModalStack } from "../modals/CustomModalStack";
import useGetUsersByRoles from "@/hooks/admin/useGetUsersByRoles";
import MedReverseDrawer from "../drawers/MedReverseDrawer";
import AssignUsersToRole from "./AssignUsersToRole";
import { useMedStore } from "@/providers/med-provider";
import { toast } from "sonner";
import { PermissionsDataType } from "@/types";

const RolesBox = () => {
  const {adminPermissions} = useMedStore((state) => state);
  usePageButtons([
    {
      type: "button",
      variant: "filled",
      label: "Add Role",
      size: "md",
      radius: 35,
      onClick: () => handleCreate(),
    },
  ]);
  const { data, isLoading } = useGetAllRoles();
  const { data: usersData } = useGetUsersByRoles("admin");

  const stack = useModalsStack<string>(["confirm-action"]);

  const {
    addRole: { mutateAsync: addRoleMutateAsync, isPending: addRoleIsPending },
    updateRole: {
      mutateAsync: updateRoleMutateAsync,
      isPending: updateRoleIsPending,
    },
    removeRole: {
      mutateAsync: removeRoleMutateAsync,
      isPending: removeRoleIsPending,
    },
  } = useHandleRoles();

  const [active, setActive] = useState(0);

  const [opened, { open, close }] = useDisclosure(false);

  const [drawerOpened, { open: drawerOpen, close: drawerClose }] =
    useDisclosure(false);

  const [isEdited, setIsEdited] = useState<boolean>(false);

  const [allData, setAllData] = useState<DefaultRoles>();

  const extractedData = useMemo(() => data && data?.[active], [data, active]);

  const defaultkeys =
    extractedData && Object?.keys(extractedData && extractedData?.permissions);

  const handleEdit = () => {
        const isAllowed = checkPermission(
          adminPermissions?.permissions as PermissionsDataType,
          "roles",
          "update_role"
        );
        if (!isAllowed) {
          toast.error("You don't have permission to perform this action");
          return;
        }
    setIsEdited(true);
    open();
  };

  const handleDelete = () => {
    const isAllowed = checkPermission(adminPermissions?.permissions as PermissionsDataType, "roles", 'delete_role');
    if (!isAllowed) {
      toast.error("You don't have permission to perform this action");
      return
    }
    const userCountOnRole =
      usersData?.filter((lol) => lol.prefs?.subRoleId == extractedData?.$id)
        .length || 0;
    if (userCountOnRole > 0) {
      stack.open("confirm-action");
    } else {
      removeRoleMutateAsync(extractedData?.$id as string);
      setActive((prev) => (prev === 0 ? 0 : prev - 1));
    }
  };

  function handleCreate() {
    setIsEdited(false);
    open();
  }

  const handleSave = async () => {
            const isAllowed = checkPermission(
              adminPermissions?.permissions as PermissionsDataType,
              "roles",
              "add_role"
            );
            if (!isAllowed) {
              toast.error("You don't have permission to perform this action");
              return;
            }
    if (isEdited && data) {
      const updatedData = { ...allData, $id: data[active]?.$id };
      await updateRoleMutateAsync(updatedData as ModifiedRoles);
    } else {
      await addRoleMutateAsync(allData as DefaultRoles);
    }
    close();
  };

  const resolvedPermissions = defaultkeys?.map((item: string, index: number) => {
    const newRef = data?.[active]?.permissions[item];
    const total = newRef.length;
    const newActive = newRef.filter(
      (item: { status: boolean }) => item.status
    ).length;
    return (
      <Accordion.Item key={index} value={item}>
        <Accordion.Control
          className="capitalize"
          icon={<IconCircleCheckFilled color="green" size={24} stroke={1.5} />}
        >
          <div className="flex items-center">
            {item}
            <div className="ml-auto text-graytext pr-5">
              {newActive}/{total}
            </div>
          </div>
        </Accordion.Control>
        <Accordion.Panel pl="md">
          <ul className="flex flex-wrap gap-2">
            {extractedData?.permissions[item]?.map(
              (
                item: { label: string; status: boolean; value: string },
                index: number
              ) => (
                <li key={index} className=" w-[45%]  grow">
                  <Checkbox
                    color="gray"
                    size="sm"
                    checked={item?.status}
                    label={item?.label}
                    onChange={() => {}}
                  />
                </li>
              )
            )}
          </ul>
        </Accordion.Panel>
      </Accordion.Item>
    );
  });

  const modalFlows = [
    {
      rregisterName: "confirm-action",
      modalTitle: "Are you sure?",
      modalContent:
        "This role is currently being used by users. Move assigned users to another role before deleting it.",
      confirmBtnText: "Confirm",
      confirmBtnAction: () => {
        drawerOpen();
        stack.closeAll();
      },
    },
  ];

  const usersOnRole = usersData?.filter(
    (lol) => lol.prefs?.subRoleId == extractedData?.$id
  );

  const otherRoles = data?.filter((item) => item.$id !== extractedData?.$id)

  return (
    <div>
      <Paper shadow="xs" radius="md">
        <Grid overflow="hidden">
          <GridCol p={"20px"} span={{ base: 12, sm: 4 }}>
            <ul className="opposite-tabs">
              {data?.map((role, index) => (
                <li
                  key={index}
                  id={"roleTab"}
                  onClick={() => setActive(index)}
                  className={`${index == active ? "bg-graytext/10" : ""} flex gap-5 items-center rounded-[6px] py-[14px] pr-[16px] cursor-pointer hover:bg-graytext/10`}
                >
                  <div
                    className={`${index == active ? "visible" : "invisible"} w-[6px] h-[28px] bg-primary rounded-r-md`}
                  />
                  <Skeleton visible={isLoading}>
                    <span
                      className={`${index == active ? "font-semibold" : ""} text-[16px] capitalize`}
                    >
                      {parseResponse(role?.type)}
                    </span>
                  </Skeleton>

                  <IconChevronCompactRight
                    size={16}
                    strokeWidth={3}
                    color="gray"
                    className={`ml-auto tabIcon`}
                  />
                </li>
              ))}
            </ul>
          </GridCol>
          <GridCol
            py={"20px"}
            pl={0}
            className={" border-l border-graytext/10"}
            span={{ base: 12, sm: 8 }}
          >
            <div className=" px-[32px]">
              <Group justify="space-between">
                <Text component="h2" fw={600} lh={"24px"} fz={"16px"}>
                  Permissions
                </Text>
                <div className="flex items-center gap-2">
                  <Button
                    variant="subtle"
                    color="blue"
                    size="md"
                    leftSection={<IconEdit />}
                    onClick={handleEdit}
                  >
                    Edit role
                  </Button>
                  <Divider orientation="vertical" />
                  <CustomCancelBtn
                    btnText="Delete Role"
                    modalContent="Are you sure you want to remove this admin role"
                    modalHeader="Delete Admin Role"
                    loading={removeRoleIsPending}
                    fn={handleDelete}
                    btnProps={{
                      color: "red",
                      variant: "subtle",
                      size: "md",
                      leftSection: <IconTrash />,
                    }}
                  />
                </div>
              </Group>
            </div>
            <Divider my="sm" />
            <section>
              <Accordion variant="filled">{resolvedPermissions}</Accordion>
            </section>
          </GridCol>
        </Grid>
      </Paper>

      {/* editor and creator */}
      <MedReverseDrawerWithBtns
        size={"90%"}
        position="bottom"
        title={isEdited ? "Edit role" : "Create a new role"}
        onClose={close}
        opened={opened}
        btnGroup={
          <div className="flex gap-2 items-center">
            <Button variant="light" size="md" radius={35} onClick={close}>
              Cancel
            </Button>
            <Button
              variant="filled"
              size="md"
              radius={35}
              onClick={handleSave}
              loading={addRoleIsPending || updateRoleIsPending}
            >
              {isEdited ? " Save Changes" : "Create role"}
            </Button>
          </div>
        }
      >
        <RolesForm
          objectKeys={defaultkeys}
          data={extractedData}
          isEdited={isEdited}
          setAllData={setAllData}
          allData={allData}
        />
      </MedReverseDrawerWithBtns>
      <CustomModalStack stack={stack} modalItems={modalFlows} />
      <MedReverseDrawer
        position="right"
        onClose={drawerClose}
        opened={drawerOpened}
        title={"Assign users to role"}
        closeOnClickOutside={false}
      >
        <AssignUsersToRole users={usersOnRole} roles={otherRoles} close={()=>drawerClose()} />
      </MedReverseDrawer >
    </div>
  );
};

export default RolesBox;
