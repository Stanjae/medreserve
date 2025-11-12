"use client";
import {
  Group,
  Text,
  Badge,
  Button,
  Stack,
  Alert,
  Grid,
  GridCol,
  Loader,
  Paper,
  Checkbox,
  Divider,
  Timeline,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconScale,
  IconCircleX,
  IconCurrencyDollar,
  IconChevronRight,
  IconArrowLeft,
  IconFileText,
  IconCircleCheck,
  IconProps,
  Icon,
  IconCircleXFilled,
  IconSend,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  CANCELLATION_REASONS,
  cancellationStatuses,
  statusConfig,
} from "@/constants";
import CustomInput from "../molecules/inputs/CustomInput";
import {
  RefundAppointmentParams,
  StatusHistoryItem,
} from "@/types/actions.types";
import useCancelAppointment from "@/hooks/useCancelAppointment";
import { useForm } from "@mantine/form";
import { RefundSchema } from "@/lib/schema/zod";
import useGetBankAccountDetails from "@/hooks/useGetBankAccountDetails";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from "react";
import useGetAllBanks from "@/hooks/useGetAllBanks";
import useFetchAppointment from "@/hooks/useFetchAppointment";
import { cancelRefundInitialValues } from "@/constants/formInitialValues";
import { zodResolver } from "mantine-form-zod-resolver";
import { HOSPITAL_POLICIES } from "@/constants/policies";
import {
  calculateRefundAmount,
  formatCurrency,
  getAMPM,
  getRefundEligibility,
  parseResponse,
} from "@/utils/utilsFn";
import dayjs from "dayjs";
import { transformCancelRefundData } from "@/utils/transformHelpers";
import MedReserveLoader from "../loaders/MedReserveLoader";
import FeedbackModal from "../molecules/modals/FeedbackModal";
import { useMedStore } from "@/providers/med-provider";

interface CancelAppointmentProps {
  slotId: string;
}

export default function CancelAppointmentForm({
  slotId,
}: CancelAppointmentProps) {
  const router = useRouter();
  const { data: banks } = useGetAllBanks();
  const [steps, setSteps] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);
  const { credentials } = useMedStore((state) => state);

  const { data: fetchedAppointment, isLoading: isFetchedLoading } =
    useFetchAppointment(slotId);

  const { handleCancelAction, opened, close } = useCancelAppointment();

  const consultationFeeRecord = fetchedAppointment?.paymentId?.find(
    (item) => item.type === "initial-fees"
  );

  const cancelRecord: StatusHistoryItem[] =
    fetchedAppointment?.cancelRefund &&
    JSON.parse(fetchedAppointment?.cancelRefund?.statusHistory);

  const isEligibleForRefund = getRefundEligibility(
    fetchedAppointment?.bookingDate as string,
    fetchedAppointment?.startTime as string
  );

  const calculatedRefund = calculateRefundAmount(
    fetchedAppointment?.bookingDate as string,
    fetchedAppointment?.startTime as string,
    consultationFeeRecord?.amount
  );

  const statusInfo =
    fetchedAppointment?.status &&
    statusConfig[fetchedAppointment?.status as keyof typeof statusConfig];

  const StatusIcon = statusInfo?.icon as ForwardRefExoticComponent<
    IconProps & RefAttributes<Icon>
  >;

  const form = useForm<RefundAppointmentParams>({
    mode: "uncontrolled",
    initialValues: cancelRefundInitialValues,
    validateInputOnChange: true,
    validate: zodResolver(RefundSchema),
    transformValues: (values) => {
      return {
        ...values,
        reason: `${values.reason} - ${values.notes}`,
      };
    },
  });

  useEffect(() => {
    if (fetchedAppointment) {
      if (fetchedAppointment?.cancelRefund) {
        setSteps(4);
        return;
      };
      const transformedData = transformCancelRefundData(fetchedAppointment);
      form.setValues(transformedData);
      form.setInitialValues(transformedData);
    }
  }, [fetchedAppointment]);

  const [newBankAccountNumber, setNewBankAccountNumber] = useState<string>();

  form.watch("bankCode", ({ value }) => {
    form.setValues({
      bankName: banks?.find(
        (item: { label: string; value: string }) => item?.value == value
      )?.label as string,
    });
  });

  form.watch("bankAccountNumber", ({ value }) => {
    if (value.length >= 10) {
      setNewBankAccountNumber(value);
    }

    if (value.length == 0 || value == "") {
      setNewBankAccountNumber("");
    }
  });

  const { data, isLoading, isFetching } = useGetBankAccountDetails(
    form.getValues().bankCode,
    newBankAccountNumber as string
  );

  const handleAppointmentCancellation = async (
    values: RefundAppointmentParams
  ) => {
    await handleCancelAction.mutateAsync(values);
  };

  const buttonGroups = [
    {
      label: "Cancel another appointment",
      variant: "light",
      color: "m-blue",
      onClick: () =>
        router.push(`/patient/${credentials?.userId}/dashboard/appointments`),
    },
    {
      label: "Check Status",
      variant: "filled",
      color: "m-orange",
      onClick: () => {
      setSteps(4);
        close();
      },
    },
  ];

  if (isFetchedLoading) {
    <div className="flex justify-center items-center">
      <MedReserveLoader />
    </div>;
  }
  const PoliciesStep = () => (
    <div className="mx-auto">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconScale className="text-blue-600" size={30} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Cancellation & Refund Policies
        </h1>
        <p className="text-gray-600 text-lg">
          Please read our policies before proceeding
        </p>
      </div>

      <Paper p={32} radius={"md"} mb={24} withBorder>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <IconCircleX className="text-blue-600" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {HOSPITAL_POLICIES.cancellation.title}
          </h2>
        </div>

        {HOSPITAL_POLICIES.cancellation.sections.map((section, idx) => (
          <div key={idx} className="mb-6 last:mb-0">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {section.heading}
            </h3>
            <ul className="space-y-2 ml-4">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Paper>

      <Paper p={32} radius={"md"} mb={24} withBorder>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <IconCurrencyDollar className="text-green-600" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {HOSPITAL_POLICIES.refund.title}
          </h2>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-green-900 mb-3">Refund Amounts</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">More than 24 hours</p>
              <p className="text-xl font-bold text-green-600">100% Refund</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-yellow-200">
              <p className="text-sm text-gray-600 mb-1">12-24 hours</p>
              <p className="text-xl font-bold text-yellow-600">50% Refund</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <p className="text-sm text-gray-600 mb-1">Less than 12 hours</p>
              <p className="text-xl font-bold text-red-600">No Refund</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <p className="text-sm text-gray-600 mb-1">After appointment</p>
              <p className="text-xl font-bold text-red-600">No Refund*</p>
            </div>
          </div>
        </div>

        {HOSPITAL_POLICIES.refund.sections.map((section, idx) => (
          <div key={idx} className="mb-6 last:mb-0">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {section.heading}
            </h3>
            <ul className="space-y-2 ml-4">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Paper>

      <Paper p={24} mb={20} withBorder>
        <Checkbox
          label="I have read and agree to the policies. By checking this box, I acknowledge that I have read and agree to the cancellation and refund policies."
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
      </Paper>

      <Group grow gap={10}>
        <Button
          type="button"
          onClick={() => router.back()}
          color="m-gray.2"
          size="lg"
        >
          Go Back
        </Button>
        <Button
          type="button"
          onClick={() => setSteps(1)}
          disabled={!checked}
          size="lg"
          rightSection={<IconChevronRight size={20} />}
        >
          Continue
        </Button>
      </Group>
    </div>
  );

  const AppointmentReview = () => (
    <div className="mx-auto">
      <Button
        leftSection={<IconArrowLeft />}
        onClick={() => setSteps(0)}
        variant="transparent"
        type="button"
      >
        Back to Policies
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cancel Appointment
        </h1>
        <p className="text-gray-600">Review your appointment details</p>
      </div>

      <Paper p={32} radius={"md"} mb={24} withBorder>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Dr. {fetchedAppointment?.doctorId?.fullname}
            </h2>
            <p className="text-gray-600">
              {parseResponse(
                fetchedAppointment?.doctorId?.specialization as string || ''
              )}
            </p>
          </div>
          <Badge
            variant={statusInfo?.variant}
            color={statusInfo?.color}
            leftSection={<StatusIcon />}
          >
            {fetchedAppointment?.status}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <IconCalendar className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold text-gray-900">
                {dayjs(fetchedAppointment?.bookingDate).format(
                  "dddd, MMMM D, YYYY"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <IconClock className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-semibold text-gray-900">
                {getAMPM(fetchedAppointment?.startTime as string)} -{" "}
                {getAMPM(fetchedAppointment?.endTime as string)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <IconCurrencyDollar className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Amount Paid</p>
              <p className="font-semibold text-gray-900">
                {formatCurrency(consultationFeeRecord?.amount)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <IconFileText className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">Payment Reference</p>
              <p className="font-semibold text-gray-900 text-sm">
                {consultationFeeRecord?.reference}
              </p>
            </div>
          </div>
        </div>
      </Paper>

      <Paper
        p={32}
        bg={isEligibleForRefund ? "green.1" : "red.1"}
        radius={"md"}
        mb={24}
        withBorder
      >
        <div className="flex items-start gap-4">
          {isEligibleForRefund ? (
            <IconCircleCheck
              className="text-green-600 flex-shrink-0 mt-1"
              size={28}
            />
          ) : (
            <IconCircleXFilled
              className="text-red-600 flex-shrink-0 mt-1"
              size={28}
            />
          )}
          <div className="flex-1">
            <h3
              className={`text-xl font-bold ${isEligibleForRefund ? "text-green-900" : "text-red-900"} mb-2`}
            >
              {isEligibleForRefund
                ? "You're Eligible for a Refund!"
                : "You're Not Eligible for a Refund!"}
            </h3>
            <p
              className={`${isEligibleForRefund ? "text-green-800" : "text-red-800"} text-sm font-semibold mb-4`}
            >
              {calculatedRefund.reason}
            </p>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Original Amount:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(consultationFeeRecord?.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Refund Percentage:</span>
                <span
                  className={`font-semibold ${isEligibleForRefund ? "text-green-600" : "text-red-600"}`}
                >
                  {calculatedRefund?.percentage + "%"}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    Refund Amount:
                  </span>
                  <span
                    className={`text-2xl font-bold ${isEligibleForRefund ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatCurrency(form.getValues().refundAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Paper>
      <Group justify="end">
        {isEligibleForRefund && (
          <Button
            size="lg"
            rightSection={<IconChevronRight />}
            onClick={() => setSteps(2)}
            type="button"
          >
            Continue with Cancellation
          </Button>
        )}
      </Group>
    </div>
  );

  const CancelRefundForm = () => {
    return (
      <div>
        <Button
          leftSection={<IconArrowLeft />}
          onClick={() => setSteps(1)}
          variant="transparent"
          type="button"
        >
          Back to eligibility
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Refund Appointment Form
          </h1>
          <p className="text-gray-600">Fill in your details</p>
        </div>
        <Paper p={32} radius={"md"} mb={24} withBorder>
          <Stack gap="md">
            <Text size="sm" c="dimmed"></Text>

            <Grid overflow="hidden" gutter={"md"}>
              <GridCol span={{ base: 12, md: 6, lg: 3 }}>
                <CustomInput
                  type="select"
                  radius={35}
                  placeholder="Select Bank Name"
                  label="Bank Name"
                  data={banks}
                  size="md"
                  key={form.key("bankCode")}
                  {...form.getInputProps("bankCode")}
                  searchable
                />
              </GridCol>
              <GridCol span={{ base: 12, md: 6, lg: 3 }}>
                <CustomInput
                  type="text"
                  size="md"
                  label="Bank Account Number"
                  placeholder="Enter your bank account number"
                  styles={{ root: { grow: 1 } }}
                  disabled={!form.isDirty("bankCode")}
                  radius={35}
                  key={form.key("bankAccountNumber")}
                  {...form.getInputProps("bankAccountNumber")}
                  onKeyDown={(event) => {
                    // Allow: backspace, delete, tab, escape, enter, arrows
                    if (
                      [8, 9, 27, 13, 46, 37, 38, 39, 40].includes(
                        event.keyCode
                      ) ||
                      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (event.ctrlKey &&
                        [65, 67, 86, 88].includes(event.keyCode))
                    ) {
                      return;
                    }
                    // Block if not a number
                    if (
                      event.shiftKey ||
                      ((event.keyCode < 48 || event.keyCode > 57) &&
                        (event.keyCode < 96 || event.keyCode > 105))
                    ) {
                      event.preventDefault();
                    }
                  }}
                />
                <div className=" mt-2 flex items-center">
                  {(isLoading || isFetching) && <Loader size={"xs"} />}
                  {data?.status && (
                    <Text size="xs" fw={700} c="green.7">
                      {data?.data?.account_name}
                    </Text>
                  )}
                </div>
              </GridCol>
            </Grid>
            <CustomInput
              type="select"
              radius={35}
              size="md"
              placeholder="Select cancellation reason"
              description={
                "Please select a reason for cancellation. Refund policies apply based on cancellation timing."
              }
              label="Cancellation Reason"
              data={CANCELLATION_REASONS}
              key={form.key("reason")}
              {...form.getInputProps("reason")}
              searchable={false}
            />
            <CustomInput
              type="textarea"
              radius={12}
              size="md"
              label="Additional details (optional)"
              placeholder="Enter additional information on your reasons"
              key={form.key("notes")}
              {...form.getInputProps("notes")}
            />
          </Stack>
        </Paper>

        {/* Action Buttons */}
        <Group justify="flex-end" gap="md" mt="lg">
          <Button
            type="button"
            size="md"
            onClick={() => setSteps((prev) => prev + 1)}
          >
            Review Cancellation
          </Button>
        </Group>
      </div>
    );
  };

  const FinalConfirmation = () => (
    <div className="mx-auto">
      <Button
        onClick={() => setSteps((prev) => prev - 1)}
        variant="transparent"
        leftSection={<IconArrowLeft />}
      >
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Confirm Cancellation
        </h1>
        <p className="text-gray-600">Review your cancellation details</p>
      </div>

      <Paper p={32} radius={"md"} mb={24} withBorder>
        <h3 className="font-bold text-gray-900 mb-4">Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Doctor:</span>
            <span className="font-semibold text-gray-900">
              Dr. {fetchedAppointment?.doctorId?.fullname}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">Reason:</span>
            <span className="font-semibold text-gray-900">
              {form.getValues().reason}
            </span>
          </div>
          <div className="flex justify-between py-3 bg-green-50 rounded-lg px-4">
            <span className="text-green-800 font-semibold">Refund Amount:</span>
            <span className="font-bold text-green-600 text-xl">
              {formatCurrency(form.getValues().refundAmount)}
            </span>
          </div>
          <div className="flex justify-between py-3 bg-red-50 rounded-lg px-4">
            <span className="text-red-800 font-semibold">Processing Fee:</span>
            <span className="font-bold text-red-600 text-xl">
              - {formatCurrency(form.getValues().cancellationFee)}
            </span>
          </div>
          <Divider size="xs" color="blue.2" my={8} />
          <div className="flex justify-between py-3 bg-green-50 rounded-lg px-4">
            <span className="text-green-800 font-semibold">Total Refund:</span>
            <span className="font-bold text-green-600 text-xl">
              {formatCurrency(
                Number(form.getValues().refundAmount) -
                  Number(form.getValues().cancellationFee)
              )}
            </span>
          </div>
        </div>
      </Paper>

      <Alert
        variant="light"
        color="red"
        title="This action cannot be undone"
        icon={<IconInfoCircle />}
      >
        Your appointment will be cancelled immediately.
      </Alert>

      <Group mt="xl" justify="flex-end">
        <Button
          color="m-blue"
          variant="light"
          size="md"
          type="button"
          onClick={() => setSteps((prev) => prev - 1)}
        >
          Back
        </Button>
        <Button
          type="submit"
          size="md"
          loading={form.submitting}
          rightSection={<IconSend />}
        >
          Confirm Cancellation
        </Button>
      </Group>
    </div>
  );

  const CancelTimelines = () => (
    <Paper p={32} radius={"md"} mb={24} withBorder>
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Status Timeline</h2>

      <div className="relative">
        <Timeline
          active={cancelRecord?.length - 1}
          bulletSize={24}
          lineWidth={3}
        >
          {cancellationStatuses.map(({ icon: Icon, ...item }, index) => (
            <Timeline.Item
              key={index}
              bullet={<Icon />}
              title={<span className="text-secondary">{item.label}</span>}
              lineVariant={
                index == 4 && cancelRecord?.length == 6 ? "dashed" : "solid"
              }
            >
              <div
                className={`${item.bgLight} border-l-4 ${item.color} rounded-lg p-6`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3
                      className={`text-xl font-bold ${item.textColor} mb-1`}
                    >
                      {item.label}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-600 border border-gray-200">
                    {item.timeline}
                  </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Actions:
                    </p>
                    <ul className="space-y-1">
                      {item.actions.map((action, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-600 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </Paper>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4">
      <form
        onSubmit={form.onSubmit(
          async (values) => await handleAppointmentCancellation(values)
        )}
      >
        {steps === 0 && <PoliciesStep />}
        {steps === 1 && <AppointmentReview />}
        {steps === 2 && <CancelRefundForm />}
        {steps === 3 && <FinalConfirmation />}
        {steps === 4 && <CancelTimelines />}
      </form>
      <FeedbackModal
        opened={opened}
        title={"Cancellation Confirmed"}
        description="Your refund is being processed."
        buttons={buttonGroups}
        content={
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Refund Reference:</span>
              <span className="font-mono font-bold text-gray-900">
                REF_{form.getValues().refundReference}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Refund Amount:</span>
              <span className="font-bold text-green-600 text-xl">
                {formatCurrency(
                  Number(form.getValues().refundAmount) -
                    Number(form.getValues().cancellationFee)
                )}
              </span>
            </div>
          </div>
        }
      />
    </div>
  );
}
