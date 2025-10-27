"use client";
import { Models } from "node-appwrite";
import React from "react";
import { ModifiedRoles } from "../../../types/appwrite";
import { Button, Checkbox, Divider, Group, Paper } from "@mantine/core";
import CustomInput from "../molecules/inputs/CustomInput";
import { parseResponse } from "@/utils/utilsFn";
import useHandleRoles from "@/hooks/admin/useHandleRoles";

type Props = {
  roles: ModifiedRoles[] | undefined;
  users: Models.User<Models.Preferences>[] | undefined;
  close: () => void;
};

const AssignUsersToRole = ({ roles, users }: Props) => {
  const [selectedRole, setSelectedRole] = React.useState<string | null>();
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const rolesList = roles?.map((role) => ({
    label: parseResponse(role.type),
    value: role.$id,
  }));

  const isComplete = selectedRole && selectedUsers.length > 0;

  const {
    bulkAssignUsersToNewRole: { mutateAsync, isPending },
  } = useHandleRoles();

  const handleRoleAssign = async () => {
    const role = selectedUsers.map((id) => {
      const prefs = users?.find((user) => user.$id === id)?.prefs;
      return { userId: id, prefs: { ...prefs, subRoleId: selectedRole } };
    });
    await mutateAsync(role);
    setSelectedRole(null);
  };
  return (
    <div>
      <Paper p={20} shadow="md" radius={"md"}>
        <CustomInput
          type="select"
          data={rolesList}
          value={selectedRole}
          onChange={(_value, option) => setSelectedRole(option.value)}
          label="Select Role"
        />
        <Divider my="sm" />

        <div>
          <Checkbox.Group value={selectedUsers} onChange={setSelectedUsers}>
            {users?.map((user) => (
              <Checkbox
                size="md"
                className="block my-2"
                key={user.$id}
                value={user?.$id}
                label={user?.name}
              />
            ))}
          </Checkbox.Group>
        </div>
        <Divider my="sm" />
        <Group justify="flex-end">
          <Button
            onClick={handleRoleAssign}
            disabled={!isComplete}
            loading={isPending}
            variant="filled"
            size="md"
            radius={35}
          >
            Assign
          </Button>
        </Group>
      </Paper>
    </div>
  );
};

export default AssignUsersToRole;
