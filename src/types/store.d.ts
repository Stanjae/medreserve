import { ButtonProps } from '@mantine/core';

export type ROLES = "patient" | "doctor" | "admin";

export type AuthCredentials = {
  userId: string;
  email: string;
  username: string;
  role: ROLES | string;
  emailVerified: boolean;
  medId: string | undefined | null;
  databaseId?: string | undefined | null;
  subRoleId?: string | undefined;
};

export type Permissions = { label: string; value: string; status: boolean };

export type PermissionKeys = 'sub_admin' | 'hospital_admin' | 'super_admin';

export type PermissionHeaderType = "users" | "appointments" | "roles" | "refunds" | "payments"

export type AllPermissions = {[key: string]: Permissions[]};

export type AdminPermissions = {
  type: PermissionKeys;
  permissions: string;
  id: string;
  priority: number;
};


//export type DoctorCredentials = AuthCredentials & {medId?: string | undefined};
type MenuProps = { type: 'menu'; triggerProps: ButtonProps; items: { label: string; action: () => void }[]; };

type HeaderButtonProps =ButtonProps & {type: 'button'; onClick: () => void};

export type HeaderButtonsType = (HeaderButtonProps | MenuProps) & {
  label: string;
};
