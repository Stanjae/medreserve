export const Rescheduling_Policy = [
  "Appointments can be rescheduled 48 hours before appointment - 15% of consultation fee",
  "Appointments can be rescheduled 24 hours before appointment - 30% of consultation fee",
  "Maximum of 3 reschedules allowed per appointment",
  "No-shows without prior cancellation will be charged the full consultation fee",
  "Same-day rescheduling is subject to availability - 50% of consultation fee",
];


export const HOSPITAL_POLICIES = {
  cancellation: {
    title: "Cancellation Policy",
    sections: [
      {
        heading: "Cancellation Timeline",
        items: [
          "Appointments can be cancelled up to 2 hours before the scheduled time",
          "For same-day cancellations (less than 2 hours notice), please call our support line",
          "Emergency cancellations will be handled on a case-by-case basis",
        ],
      },
      {
        heading: "How to Cancel",
        items: [
          "Log in to your patient dashboard",
          "Navigate to 'My Appointments'",
          "Select the appointment you wish to cancel",
          "Follow the cancellation process and provide a reason",
        ],
      },
      {
        heading: "No-Show Policy",
        items: [
          "Failure to attend without prior cancellation is considered a no-show",
          "No-show appointments are non-refundable",
          "Multiple no-shows may result in booking restrictions",
          "If the doctor fails to attend, you are eligible for a full refund",
        ],
      },
    ],
  },
  refund: {
    title: "Refund Policy",
    sections: [
      {
        heading: "Refund Eligibility",
        items: [
          "More than 24 hours before appointment: 100% refund",
          "12-24 hours before appointment: 50% refund",
          "Less than 12 hours before appointment: No refund",
          "After appointment time: No refund (except doctor no-show)",
        ],
      },
      {
        heading: "Refund Processing",
        items: [
          "Refunds are processed within 24-48 hours of approval",
          "Funds are returned to your original payment method",
          "Bank processing may take 5-7 business days",
          "Processing fees (if any) are non-refundable",
        ],
      },
    ],
  },
};