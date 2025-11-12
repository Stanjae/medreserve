export const serviceEndpoints = {
  EMAILS: {
    sendEmail: "send-email",
  verifyEmail: "verify-email",
  confirmAppointment: "/api/medreserve/confirm-appointment",
  rescheduleEmail: "/api/medreserve/reschedule-appointment",
  },
  PAYSTACK: {
    initializeTransaction: "/api/paystack/initialize-transaction",
    verifyStatus: "/api/paystack/verify-status",
  },
  AUTH: {
    forgotPassword: "/api/medreserve/forgot-password",
  }
};
