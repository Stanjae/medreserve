import {
  IconCalendarBolt,
  IconCalendarWeek,
  IconChevronRight,
  IconCoins,
  IconDashboard,
  IconReportAnalytics,
  IconSearch,
} from "@tabler/icons-react";

export const Toplinks = [
  {
    href: "/",
    label: "Home",
    rightIcon: <IconChevronRight size={12} stroke={1.5} />,
  },
  {
    href: "/about",
    label: "About Us",
    rightIcon: <IconChevronRight size={12} stroke={1.5} />,
  },
  {
    href: "/about-us1",
    label: "About Us",
    rightIcon: <IconChevronRight size={12} stroke={1.5} />,
  },
  {
    href: "/about-us2",
    label: "About Us",
    rightIcon: <IconChevronRight size={12} stroke={1.5} />,
  },
  {
    href: "/about-us3",
    label: "About Us",
    rightIcon: <IconChevronRight size={12} stroke={1.5} />,
  },
  {
    href: "/about-us4",
    label: "Help",
    rightIcon: <IconChevronRight size={12} stroke={1.5} />,
  },
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
    leftIcon: <IconDashboard size={17} stroke={1.5} />,
  },
  {
    label: "Appointments",
    href: "appointments",
    child: true,
    leftIcon: <IconCalendarBolt size={17} stroke={1.5} />,
    sub: [
      { label: "Overview", href: 'index' },
      { label: "Book an Appointment", href: "book-appointment" },
    ],
  },
  {
    label: "payments",
    href: "payments",
    child: false,
    leftIcon: <IconCoins size={17} stroke={1.5} />,
  },
];

export const dashboardShortCutLinks = [
  {
    title: "Book Appointment",
    description: "Schedule a new appointment with your preferred doctor",
    href: "/patient/userId/dashboard/appointments/book-appointment",
    icon: <IconCalendarWeek size={40} stroke={1.5} color="#fff" />,
  },
  {
    title: "Find Doctors",
    description: "Search for specialists in your area",
    href: "/patient/userId/dashboard/appointments/book-appointment",
    icon: <IconSearch size={40} stroke={1.5} color="#fff" />,
  },
    {
    title: "View Records",
    description: "Access your complete medical history",
    href: "/patient/userId/dashboard/appointments/book-appointment",
    icon: <IconReportAnalytics size={40} stroke={1.5} color="#fff" />,
  },
      {
    title: "Prescriptions",
    description: "Manage your medications and refills",
    href: "/patient/userId/dashboard/appointments/book-appointment",
    icon: <IconReportAnalytics size={40} stroke={1.5} color="#fff" />,
  }
];
