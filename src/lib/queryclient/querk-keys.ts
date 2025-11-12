export const QUERY_KEYS = {
  SIGNUPS: {
    getAllSignups: "all-signups",
    signupsTabsCount: "signups-tabs-count",
  },
  ROLES: {
    getAllRoles: "all-roles",
    getUsersByRole: "users-by-role",
  },
  USERS: {
    getUsersTabsCount: "usersCountTabs",
    getAllUsers: "all-users",
    fetchUserForEdit: "fetch-user-for-edit",
  },
  APPOINTMENTS: {
    getMonthYearAppointments: "appointments-month-year",
    searchForAppointments: "search-for-appointments-by-id",
    getAdminAppointmentDetail: "get-admin-appointment-detail",

    //patients
    getAvailableDoctorsFilterAction: "get-available-doctors-filter-action",
    checkIfUserBookedASlot: "check-if-user-booked-a-slot",
    getAvailableSlots: "get-available-slots",
    getPatientAppointments: "get-patient-appointments",
    fetchAppointmentForReschedule: "fetch-appointment-for-reschedule",
  },
  HISTORY: {
    getAllHistory: "all-history",
  },
};
