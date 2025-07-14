/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { AppointmentColumnsType } from "@/types/table";
import { getAMPM, getAMPWAT, isbBeforeDateTime } from "@/utils/utilsFn";
import { ActionIcon, Badge, Button, Checkbox, Menu } from "@mantine/core";
import {
  IconArrowsUpDown,
  IconCancel,
  IconCircleCheck,
  IconClockHour7,
  IconClockPlay,
  IconCreditCardPay,
  IconCreditCardRefund,
  IconDots,
  IconDownload,
} from "@tabler/icons-react";
import { compareItems } from "@tanstack/match-sorter-utils";
import { ColumnDef, SortingFn, sortingFns } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CDropdown } from "../dropdown/CDropdown";
import { CustomHoverCard } from "../hovercard/CustomHoverCard";
import AppointmentTableHoverCard from "../cards/AppointmentTableHoverCard";
import Link from "next/link";
import GeneratePdfButton from "../boxes/NewPdf";
import PdfLayout from "../layout/PdfLayout";
import AppointmentReceipt from "../pdfTemplates/AppointmentReceipt";
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
    cell: ({ row }) => (
      <CustomHoverCard
        props={{
          width: 240,
          shadow: "md",
          withArrow: true,
          openDelay: 200,
          closeDelay: 400,
        }}
        trigger={<p className="capitalize">Dr. {row.getValue("doctorName")}</p>}
      >
        <AppointmentTableHoverCard row={row.original} />
      </CustomHoverCard>
    ),
    filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
    header: ({ column }) => {
      return (
        <Button
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Doctor&apos;s Name
          <IconArrowsUpDown />
        </Button>
      );
    },
  },
  {
    accessorFn: (row) => {
      return dayjs().isSame(dayjs(row.bookingDate))
        ? "today"
        : isbBeforeDateTime(row.bookingDate)
          ? "past"
          : "upcoming";
    },
    id: "timeFrameStatus",
    header: "Status",
    cell: (info) => (
      <Badge
        color={
          info.getValue() == "upcoming"
            ? "m-gray"
            : info.getValue() == "today"
              ? "m-cyan"
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
          variant="light"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Booking Date
          <IconArrowsUpDown />
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
    accessorFn: (row) => row.paymentStatus,
    id: "paymentStatus",
    header: "Payment Status",
    cell: (info) => (
      <Badge
        leftSection={
          info.getValue() == "pending" ? (
            <IconClockHour7 size={12} />
          ) : (
            <IconCircleCheck size={12} />
          )
        }
        color={info.getValue() == "pending" ? "yellow" : "green"}
      >
        {info.getValue()}
      </Badge>
    ),
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      console.log('opera:',payment);
      return (
        <CDropdown
          props={{
            styles: { item: { fontSize: 13 } },
            width: 150,
            position: "bottom-end",
          }}
          trigger={
            <ActionIcon variant="transparent" aria-label="more options">
              <IconDots size={16} />
            </ActionIcon>
          }
        >
          <Menu.Dropdown>
            {payment.paymentStatus == "pending" ? (
              <>
                {/*  href={`/patient/${credentials?.userId}/dashboard/appointments/book-appointment/${doctorId}/step-2?slotId=${userBookedSlot?.at(0)?.$id}`} */}
                <Menu.Item
                  component={Link}
                  href={`/patient/${payment.patientUserId}/dashboard/appointments/book-appointment/${payment.doctorUserId}/step-2?slotId=${payment.slotId}`}
                  leftSection={<IconCreditCardPay size={13} />}
                >
                  Make Payment
                </Menu.Item>
                <Menu.Item color="red" leftSection={<IconCancel size={13} />}>
                  Cancel Booking
                </Menu.Item>
              </>
            ) : (
              <>
                {payment.bookingDate &&
                  !isbBeforeDateTime(payment.bookingDate) && (
                    <>
                      <GeneratePdfButton
                        appointmentDate={payment?.bookingDate}
                        appointmentTime={getAMPWAT(
                          `${payment?.bookingDate}T${payment?.startTime}`
                        )}
                        doctorName={payment.doctorName}
                        patientName={
                          JSON.parse(payment.paymentId?.metaData)?.fullname
                        }
                        email={
                          JSON.parse(payment.paymentId?.metaData)?.email
                        }
                        trigger={
                          <Menu.Item
                            color="green"
                            leftSection={<IconDownload size={13} />}
                          >
                            Get Receipt
                          </Menu.Item>
                        }
                        PdfElement={
                          <PdfLayout>
                            <AppointmentReceipt response={payment.paymentId} />
                          </PdfLayout>
                        }
                      />
                      <Menu.Item leftSection={<IconClockPlay size={13} />}>
                        Reschedule
                      </Menu.Item>
                    </>
                  )}
                <Menu.Item
                  color="red"
                  leftSection={<IconCreditCardRefund size={13} />}
                >
                  Refund
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </CDropdown>
      );
    },
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
