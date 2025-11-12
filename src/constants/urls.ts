'use client'
import {
  IconCalendarBolt,
  IconCalendarTime,
  IconCalendarWeek,
  IconCoins,
  IconDashboard,
  IconHome,
  IconLicense,
  IconReportAnalytics,
  IconSearch,
  IconStethoscope,
  IconUsersGroup,
} from "@tabler/icons-react";

export const toplinks = [
  {
    href: "/",
    label: "Home",
    rightIcon: IconHome
  },
  {
    href: "/about",
    label: "About Us",
    rightIcon: IconStethoscope
  },
  {
    href: "/our-doctors",
    label: "Our Doctors",
    rightIcon: IconUsersGroup
  }
];

export const footerLinks = [
  {
    title: "Company",
    navLinks: [
      { href: "/", label: "Home" },
      { href: "/about-us", label: "About Us" },
      { href: "/about-us1", label: "Our Doctors" },
      { href: "/about-us2", label: "Latest Blog" },
      { href: "/about-us3", label: "Careers" },
      { href: "/about-us4", label: "Contact" },
    ],
  },
  {
    title: "Support",
    navLinks: [
      { href: "/", label: "Reviews" },
      { href: "/about-us", label: "FAQs" },
      { href: "/about-us1", label: "Help Center" },
      { href: "/about-us2", label: "Doctors" },
    ],
  },
  {
    title: "Legal",
    navLinks: [
      { href: "/", label: "Home" },
      { href: "/about-us", label: "About Us" },
      { href: "/about-us1", label: "Our Doctors" },
      { href: "/about-us2", label: "Latest Blog" },
      { href: "/about-us3", label: "Careers" },
      { href: "/about-us4", label: "Contact" },
    ],
  },
  { title: "Company", navLinks: [] },
];

export const patientDashLinks = [
  {
    label: "Dashboard",
    href: "dashboard",
    child: false,
    leftIcon: IconDashboard,
  },
  {
    label: "Appointments",
    href: "appointments",
    child: true,
    leftIcon: IconCalendarBolt,
    sub: [
      { label: "Manage Appointments", href: 'index' },
      { label: "Book an Appointment", href: "book-appointment" },
    ],
  },
  {
    label: "payments",
    href: "payments",
    child: false,
    leftIcon: IconCoins,
  },
];

export const dashboardShortCutLinks = [
  {
    title: "Book Appointment",
    description: "Schedule a new appointment with your preferred doctor",
    href: "/patient/userId/dashboard/appointments/book-appointment",
    icon: IconCalendarWeek
  },
  {
    title: "Find Doctors",
    description: "Search for specialists in your area",
    href: "/patient/userId/dashboard/appointments/book-appointment",
    icon: IconSearch,
  },
    {
    title: "View Records",
    description: "Access your complete medical history",
    href: "/patient/userId/dashboard/appointments/book-appointment",
    icon: IconReportAnalytics,
  },
      {
    title: "Prescriptions",
    description: "Manage your medications and refills",
    href: "/patient/userId/dashboard/appointments/book-appointment",
    icon: IconReportAnalytics,
  }
];


export const adminDashLinks = [
  {
    label: "Dashboard",
    href: "dashboard",
    child: false,
    leftIcon: IconDashboard,
    allowedSubRoles: ["super_admin", "hospital_admin", "sub_admin"],
  },
  {
    label: "Users",
    href: "users",
    child: false,
    leftIcon: IconUsersGroup,
    allowedSubRoles: ["super_admin", "hospital_admin", "sub_admin"],
  },
  {
    label: "Appointments",
    href: "appointments",
    child: true,
    leftIcon: IconCalendarTime,
    allowedSubRoles: ["super_admin", "hospital_admin", "sub_admin"],
    sub: [
      { label: "Calendar", href: "index" },
      { label: "Find Appointments", href: "find-appointments" },
    ],
  },
  {
    label: "payments",
    href: "payments",
    child: false,
    leftIcon: IconCoins,
  },
];

export const adminSecondaryDashLinks = [
  {
    label: "New Signups",
    href: "new-signups",
    child: false,
    leftIcon: IconUsersGroup,
    allowedSubRoles: ["super_admin", "hospital_admin", "sub_admin"],
  },
  {
    label: "Roles",
    href: "roles",
    child: false,
    leftIcon: IconLicense,
    allowedSubRoles: ["super_admin"],
  },
];
