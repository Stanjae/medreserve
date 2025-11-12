import { getPatientBookingReference } from "@/lib/actions/getActions";
import { getAMPWAT } from "@/utils/utilsFn";
import {  Divider, Group, Text } from "@mantine/core";
import GeneratePdfBox from "../molecules/boxes/GeneratePdfBox";

const AppointmentReferenceCard = async ({
  paymentreferenceId,
}: Readonly<{ paymentreferenceId: string }>) => {
  const response = await getPatientBookingReference(paymentreferenceId);
  const metaData = JSON.parse(response?.metaData || "");
  const authorization = JSON.parse(response?.authorization || "");
  return (
    <main>
      <section className="pr-3">
        <Group justify="space-between">
          <h4 className=" text-[26px] capitalize font-extrabold leading-[44px] mt-[0px] mb-[4px] text-left text-secondary">
            Dear, {metaData?.fullname}
          </h4>
          <GeneratePdfBox response={response} />
        </Group>

        <p className=" text-[16px] font-semibold leading-[30px] mt-[4px] mb-[16px] text-left text-gray-600">
          Your appointment with Dr. {response?.doctorId?.fullname} has been
          successfully completed.
        </p>
        <div className=" space-y-3">
          <Group justify="space-between">
            <Text fz={18} c="m-gray">
              Name:
            </Text>
            <Text className=" capitalize" fz={18} c="m-blue">
              {metaData?.fullname}
            </Text>
          </Group>
          <Divider variant="dotted" color={"m-cyan"} />
          <Group justify="space-between">
            <Text fz={18} c="m-gray">
              Booking For:
            </Text>
            <Text className=" capitalize" fz={18} c="m-blue">
              {metaData?.capacity + "  "}
              {metaData?.capacity == "1" ? "Person" : "Persons"}
            </Text>
          </Group>
          <Divider variant="dotted" color={"m-cyan"} />
          <Group justify="space-between">
            <Text fz={18} c="m-gray">
              Email:
            </Text>
            <Text className="" fz={18} c="m-blue">
              {metaData?.email}
            </Text>
          </Group>
          <Divider variant="dotted" color={"m-cyan"} />
          <Group justify="space-between">
            <Text fz={18} c="m-gray">
              Date:
            </Text>
            <Text className=" capitalize" fz={18} c="m-blue">
              {response?.appointment?.bookingDate}
            </Text>
          </Group>
          <Divider variant="dotted" color={"m-cyan"} />
          <Group justify="space-between">
            <Text fz={18} c="m-gray">
              Time:
            </Text>
            <Text className=" capitalize" fz={18} c="m-blue">
              {getAMPWAT(
                `${response?.appointment?.bookingDate}T${response?.appointment?.startTime}Z`
              )}
            </Text>
          </Group>
          <Divider variant="dotted" color={"m-cyan"} />
          <Group justify="space-between">
            <Text fz={18} c="m-gray">
              Doctor&apos;s Name:
            </Text>
            <Text className=" capitalize" fz={18} c="m-blue">
              Dr. {response?.doctorId?.fullname}
            </Text>
          </Group>
          <Divider variant="dotted" color={"m-cyan"} />
          <Group justify="space-between">
            <Text fz={18} c="m-gray">
              Booking Code:
            </Text>
            <Text className=" capitalize" fz={18} c="m-blue">
              # {response?.appointment?.$id}
            </Text>
          </Group>
          <Divider variant="dotted" color={"m-cyan"} />
          <Group justify="space-between">
            <Text fz={18} c="m-gray">
              Payment Reference:
            </Text>
            <Text className=" capitalize" fz={18} c="m-blue">
              {response?.reference}
            </Text>
          </Group>
          <Divider variant="dotted" color={"m-cyan"} />
          <Group justify="space-between">
            <Text fz={18} c="m-gray">
              Payment Method:
            </Text>
            <Text className=" capitalize" fz={18} c="m-blue">
              {authorization?.card_type + " " + authorization?.channel}
            </Text>
          </Group>
        </div>
        <p className=" text-[16px] font-semibold leading-[30px] mt-[40px] mb-[10px] text-left text-gray-600">
          Please check your email for more details.
        </p>
      </section>
    </main>
  );
};

export default AppointmentReferenceCard;
