export type AuthStore = {
  $id: "6850d569001fe1fd29c6";
  $createdAt: "2025-06-17T02:39:39.476+00:00";
  $updatedAt: "2025-06-17T02:39:39.476+00:00";
  name: string;
  registration: "2025-06-17T02:39:39.475+00:00";
  status: true;
  labels: [];
  passwordUpdate: "2025-06-17T02:39:39.475+00:00";
  email: "stanjae29@gmail.com";
  phone: "";
  emailVerification: false;
  phoneVerification: false;
  mfa: false;
  prefs: '{"terms_and_conditions":true}';
  targets: [
    {
      $id: "6850d56b7e4667a6e40e";
      $createdAt: "2025-06-17T02:39:39.517+00:00";
      $updatedAt: "2025-06-17T02:39:39.517+00:00";
      name: "";
      userId: "6850d569001fe1fd29c6";
      providerId: null;
      providerType: "email";
      identifier: "stanjae29@gmail.com";
      expired: false;
    },
  ];
  accessedAt: "2025-06-17T02:39:39.475+00:00";
};

export type ROLES = "patient" | "doctor" | "admin";

export type AuthCredentials = {
  userId: string;
  email: string;
  username: string;
  role: ROLES | string;
  emailVerified: boolean;
  medId: string | undefined | null;
  databaseId?: string | undefined | null;
};

//export type DoctorCredentials = AuthCredentials & {medId?: string | undefined};
