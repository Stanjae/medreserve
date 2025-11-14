/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  AppointmentColumnsType,
  PaymentColumnsType,
} from "@/types/table.types";
import {
  convertToCurrency,
  getAMPM,
  getCalendarDateTime,
  getDateTimeAMPM,
  parseResponse,
} from "@/utils/utilsFn";
import { Badge, Button, Checkbox } from "@mantine/core";
import { IconArrowsUpDown } from "@tabler/icons-react";
import { compareItems } from "@tanstack/match-sorter-utils";
import { ColumnDef, SortingFn, sortingFns } from "@tanstack/react-table";
import { CustomHoverCard } from "../hovercard/CustomHoverCard";
import AppointmentTableHoverCard from "../cards/TableHoverDoctorCard";
import { statusConfig } from "@/constants";
import { MedicalRecord, ModifiedUser, Reviews } from "../../../types/appwrite";
import dayjs from "dayjs";
import { ROLES } from "@/types/store.types";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};
/* export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,

    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
   {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
]; */

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank,
      rowB.columnFiltersMeta[columnId]?.itemRank
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export const columnsAppointment: ColumnDef<AppointmentColumnsType, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onChange={(event) =>
          table.toggleAllPageRowsSelected(event.currentTarget.checked)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected() && !row.getIsSelected()}
        onChange={(event) => row.toggleSelected(event.currentTarget.checked)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "doctorName",
    id: "doctorName",
    cell: ({ row }) => (
      <CustomHoverCard
        props={{
          width: 240,
          shadow: "md",
          withArrow: true,
          openDelay: 200,
          closeDelay: 400,
        }}
        trigger={
          <p className="capitalize hover:underline">
            Dr. {row.getValue("doctorName")}
          </p>
        }
      >
        <AppointmentTableHoverCard bio={row.original.bio} doctorName={row.original.doctorName} profilePicture={row.original.profilePicture} rating={row.original.rating} specialization={row.original.specialization } />
      </CustomHoverCard>
    ),
    filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          className=" pl-0 text-[14.5px] font-bold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Doctor&apos;s Name
          <IconArrowsUpDown size={13} />
        </Button>
      );
    },
  },
  {
    accessorKey: "appointmentType",
    header: "Type",
    cell: (info) => (
      <Badge
        color={
          info.getValue() == "follow-up"
            ? "m-gray"
            : info.getValue() == "consultation"
              ? "green.9"
              : "red"
        }
      >
        {info.getValue()}
      </Badge>
    ),
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
  {
    accessorKey: "bookingDate",
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          className=" pl-0 text-[14.5px] font-bold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Booking Date
          <IconArrowsUpDown size={13} />
        </Button>
      );
    },
    filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
  },
  {
    accessorFn: (row) => `${getAMPM(row.startTime)} - ${getAMPM(row.endTime)}`,
    id: "timeFrameTimeZone",
    header: "Duration",
    cell: (info) => info.getValue(),
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },

  {
    accessorFn: (row) => row.appointmentStatus,
    id: "paymentStatus",
    header: "Payment Status",
    cell: (info) => {
      const statusKey = info.getValue() as keyof typeof statusConfig;
      const config = statusConfig[statusKey];
      const IconComponent = config.icon;
      return (
        <Badge
          leftSection={<IconComponent size={12} />}
          color={config.color}
          variant={config.variant}
        >
          {info.getValue()}
        </Badge>
      );
    },
    //filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },

  /* {
    accessorFn: (row) => `${row.paymentStatus} ${row.timeFrameTimeZone}`,
    id: "f",
    header: "Full Name",
    cell: (info) => info.getValue(),
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  }, */
];

export const columnsPayment: ColumnDef<PaymentColumnsType, any>[] = [
  {
    accessorFn: (row) =>
      `${row.doctorName} | ${parseResponse(row.specialization)}`,
    header: "Appointment",
    id: "appointment",
    cell: (info) => (
      <p className="capitalize hover:underline">Dr. {info.getValue()}</p>
    ),
    filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
  },
  {
    accessorKey: "reference",
    header: "Payment Reference",
    cell: (info) => <p>#{info.getValue()}</p>,
    filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
  },
  {
    accessorFn: (row) => convertToCurrency(Number(row.amount)),
    id: "amount",
    cell: (info) => <p className=" font-medium">&#8358; {info.getValue()}</p>,
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          className=" pl-0 text-[14.5px] font-bold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <IconArrowsUpDown size={13} />
        </Button>
      );
    },
    sortingFn: fuzzySort,
    filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <Badge color={info.getValue() == "success" ? "green.8" : "red"}>
        {info.getValue()}
      </Badge>
    ),
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
  },
  {
    accessorFn: (row) => `${getDateTimeAMPM(row.createdAt)}`,
    id: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          className=" pl-0 text-[14.5px] font-bold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paid At
          <IconArrowsUpDown size={13} />
        </Button>
      );
    },
    cell: (info) => info.getValue(),
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
];

//Admin tables
export const columnsSignups: ColumnDef<ModifiedUser, any>[] = [
  {
    accessorFn: (row) => row.profile?.fullname ?? "-",
    id: "fullname",
    cell: ({ row }) => (
      <p className="capitalize hover:underline">
        {row?.original.labels == "doctor" ? "Dr." : ""}{" "}
        {row.getValue("fullname")}
      </p>
    ),
    filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          className=" pl-0 text-[14.5px] font-bold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fullname
          <IconArrowsUpDown size={13} />
        </Button>
      );
    },
  },

  {
    accessorKey: "name",
    id: "name",
    cell: ({ row }) => (
      <p className="capitalize hover:underline">{row.getValue("name")}</p>
    ),
    filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          className=" pl-0 text-[14.5px] font-bold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <IconArrowsUpDown size={13} />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    id: "email",
    header: "Email",
    cell: (info) => info.getValue() || "N/A",
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
  {
    accessorFn: (row) => (row.emailVerification ? "verified" : " unverified"),
    id: "emailVerification",
    header: "Status",
    cell: (info) => (
      <Badge
        variant="outline"
        color={info.row?.original?.emailVerification ? "green" : "red"}
      >
        {info.getValue()}
      </Badge>
    ),
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
  {
    accessorFn: (row) => row.prefs?.medId || "N/A",
    id: "medical_Id",
    cell: ({ row }) => row.getValue("medical_Id"),
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          className=" pl-0 text-[14.5px] font-bold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Medical ID
          <IconArrowsUpDown size={13} />
        </Button>
      );
    },
    filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
  },

  {
    accessorFn: (row) => dayjs(row.registeredAt).format("YYYY-MM-DD"),
    id: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          className=" pl-0 text-[14.5px] font-bold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <IconArrowsUpDown size={13} />
        </Button>
      );
    },
    cell: (info) => (info.getValue() ? info.getValue() : "N/A"),
    //filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: dateRangeFilter,
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
];

//users tables
export const ColumnsUsersFn = (role: ROLES) => {
  const columnsUsers: ColumnDef<ModifiedUser, any>[] = [
    {
      accessorFn: (row) => row.profile?.fullname ?? "-",
      id: "fullname",
      cell: ({ row }) => (
        <p className="capitalize hover:underline">
          {row?.original.labels == "doctor" ? "Dr." : ""}{" "}
          {row.getValue("fullname")}
        </p>
      ),
      filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
      header: ({ column }) => {
        return (
          <Button
            variant="transparent"
            className=" pl-0 text-[14.5px] font-bold text-black"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fullname
            <IconArrowsUpDown size={13} />
          </Button>
        );
      },
    },

    {
      accessorKey: "name",
      id: "name",
      cell: ({ row }) => (
        <p className="capitalize hover:underline">{row.getValue("name")}</p>
      ),
      filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
      header: ({ column }) => {
        return (
          <Button
            variant="transparent"
            className=" pl-0 text-[14.5px] font-bold text-black"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Username
            <IconArrowsUpDown size={13} />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      id: "email",
      header: "Email",
      cell: (info) => info.getValue() || "N/A",
      filterFn: "fuzzy", //using our custom fuzzy filter function
      // filterFn: fuzzyFilter, //or just define with the function
      sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    },
    {
      accessorFn: (row) => (row.status ? "Active" : " Suspended"),
      id: "status",
      header: "Status",
      cell: (info) => (
        <Badge
          variant="outline"
          color={info.row?.original?.status ? "green" : "red"}
        >
          {info.getValue()}
        </Badge>
      ),
      filterFn: "fuzzy", //using our custom fuzzy filter function
      // filterFn: fuzzyFilter, //or just define with the function
      sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    },
    {
      accessorFn: (row) =>
        row.accessedAt && getCalendarDateTime(row.accessedAt),
      id: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="transparent"
            className=" pl-0 text-[14.5px] font-bold text-black"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Active
            <IconArrowsUpDown size={13} />
          </Button>
        );
      },
      cell: (info) => (info.getValue() ? info.getValue() : "N/A"),
      //filterFn: "fuzzy", //using our custom fuzzy filter function
      // filterFn: dateRangeFilter,
      sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    },
  ];
  if (role == "doctor") {
    columnsUsers.splice(columnsUsers.length - 1, 0, {
      accessorFn: (row) => row.prefs?.medId || "N/A",
      id: "medical_Id",
      cell: ({ row }) => row.getValue("medical_Id"),
      header: ({ column }) => {
        return (
          <Button
            variant="transparent"
            className=" pl-0 text-[14.5px] font-bold text-black"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Medical ID
            <IconArrowsUpDown size={13} />
          </Button>
        );
      },
      filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
    });
  }

  if (role == "admin") {
    columnsUsers.splice(columnsUsers.length - 1, 0, {
      accessorFn: (row) =>
        row.prefs?.subRole ? parseResponse(row.prefs?.subRole) : "N/A",
      id: "subrole",
      cell: ({ row }) => row.getValue("subrole"),
      header: () => {
        return (
          <Button
            variant="transparent"
            className=" pl-0 text-[14.5px] font-bold text-black"
          >
            Admin Role
          </Button>
        );
      },
      filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
    });
  }

  return columnsUsers;
};


export const columnsMedicalRecords: ColumnDef<MedicalRecord, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onChange={(event) =>
          table.toggleAllPageRowsSelected(event.currentTarget.checked)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected() && !row.getIsSelected()}
        onChange={(event) => row.toggleSelected(event.currentTarget.checked)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "diagnosis",
    header: "Diagnosis",
    cell: (info) => info.getValue(),
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
  {
    accessorKey: "doctorName",
    id: "doctorName",
    cell: ({ row }) => (
      <CustomHoverCard
        props={{
          width: 240,
          shadow: "md",
          withArrow: true,
          openDelay: 200,
          closeDelay: 400,
        }}
        trigger={
          <p className="capitalize hover:underline">
            Dr. {row.original?.appointmentId.doctorId?.fullname}
          </p>
        }
      >
        <AppointmentTableHoverCard
          bio={row.original?.appointmentId.doctorId?.bio as string}
          doctorName={row.original?.appointmentId.doctorId?.fullname as string}
          profilePicture={
            row.original?.appointmentId.doctorId?.profilePicture as string
          }
          rating={row.original?.appointmentId.doctorId?.reviewsId as Reviews[]}
          specialization={
            row.original?.appointmentId.doctorId?.specialization as string
          }
        />
      </CustomHoverCard>
    ),
    filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          className=" pl-0 text-[14.5px] font-bold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Doctor&apos;s Name
          <IconArrowsUpDown size={13} />
        </Button>
      );
    },
  },
  {
    accessorFn: (row) => row.appointmentId?.bookingDate,
    id: "bookingDate",
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <Button
          variant="transparent"
          className=" pl-0 text-[14.5px] font-bold text-black"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of Visit
          <IconArrowsUpDown size={13} />
        </Button>
      );
    },
    filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
  },
  {
    accessorFn: (row) =>
      `${getAMPM(row.appointmentId?.startTime)} - ${getAMPM(row.appointmentId?.endTime)}`,
    id: "timeFrameTimeZone",
    header: "Duration",
    cell: (info) => info.getValue(),
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
 {
    accessorFn: (row) => row.isPrescriptionCompleted,
    id: "prescriptionStatus",
    header: "Prescription Status",
    cell: (info) => {
      const statusKey = info.getValue() ? "completed" : "pending";
      const config = statusConfig[statusKey];
      const IconComponent = config.icon;
      return (
        <Badge
          leftSection={<IconComponent size={12} />}
          color={config.color}
          variant={config.variant}
        >
          {statusKey}
        </Badge>
      );
    },
    //filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },

];
