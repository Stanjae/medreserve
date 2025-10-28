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

export type AllPermissions = { [key: string]: Permissions[] };


export type PermissionsDataType = {
  "users": {
    "label": string;
    "value": "delete_user" | "update_user" | "view_users" | "verify_user" | "suspend_user" | "add_user";
    "status": boolean;
  }[];
  "roles": {
    "label": string;
    "value": "delete_role" | "update_role" | "add_role" | "view_roles" | "assign_role";
    "status": boolean;
  }[];
  "appointments": {
    "label": string;
    "value": "create_appointment" | "update_appointment" | "delete_appointment";
    "status": boolean;
  }[];
  "refunds": {
    "label": string;
    "value": "create_refunds" | "update_refunds" | "delete_refunds" | "view_refunds";
    "status": boolean;
  }[];
  "payments": {
    "label": string;
    "value": "create_payment" | "update_payment" | "delete_payment" | "view_payments";
    "status": boolean;
  }[];
}


export type AdminPermissions = {
  type: PermissionKeys;
  permissions: string;
  id: string;
  priority: number;
};

export type AdminPermissionsTypes = {
  type: PermissionKeys;
  permissions: PermissionsDataType;
  id: string;
  priority: number;
};

//export type DoctorCredentials = AuthCredentials & {medId?: string | undefined};
type MenuProps = { type: 'menu'; triggerProps: ButtonProps; items: { label: string; action: () => void }[]; };

type HeaderButtonProps =ButtonProps & {type: 'button'; onClick: () => void};

export type HeaderButtonsType = (HeaderButtonProps | MenuProps) & {
  label: string;
};
