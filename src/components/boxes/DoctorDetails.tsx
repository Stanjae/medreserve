import { getDoctorDetails } from "@/lib/actions/getActions";
import { Divider, Grid, GridCol, Group, Rating } from "@mantine/core";
import Image from "next/image";
import React from "react";
import PuzzleImage from "../../../public/puzzle-1.png";
import { parseResponse } from "@/utils/utilsFn";

const DoctorDetails = async ({ doctorId }: { doctorId: string }) => {
  const response = await getDoctorDetails(doctorId);

  const rating =
    response?.rating.reduce((acc, val) => Number(acc) + Number(val), 0) /
      response?.rating?.length || 0;
  return (
    <Grid>
      <GridCol pr={82} span={{ xs: 12, md: 7 }}>
        <section className=" space-y-[25px]">
          <h3 className=" text-secondary leading-[70px] font-extrabold text-[50px]">
            Dr. {response?.fullname}
          </h3>

          <div>
            <section className="flex items-center gap-x-4">
              <Rating value={rating} fractions={2} readOnly />
              <div className=" text-secondary leading-[30px] font-extrabold  tracking-[0.32px]">
                {Number(rating).toFixed(1)} / 5.0
              </div>
            </section>
            <Group>
              <p className=" text-graytext leading-[30px] text-[18px] font-extrabold  tracking-[0.36px] capitalize">
                {response?.cadre}
              </p>
              <Divider variant="solid" size="sm" orientation="vertical" />
              <p className=" text-graytext leading-[30px] text-[18px] font-extrabold  tracking-[0.36px]">
                {response?.experience} Year(s) Experience
              </p>
            </Group>
          </div>

          <p className=" text-graytext leading-[30px] text-[18px]   tracking-[0.36px]">
            {response?.bio}
          </p>

          {/* qualification */}
          <h4 className=" text-secondary leading-[30px] text-[30px] font-extrabold  -tracking-[0.6px] ">
            Qualification and Experience
          </h4>
          <section className=" space-y-3">
            {/* specialty */}
            <div className="flex items-center gap-x-2">
              <span className=" text-graytext leading-[30px] text-[18px] font-extrabold  tracking-[0.32px]">
                Specialty:
              </span>
              <p className=" capitalize text-graytext leading-[30px] text-[18px] font-medium  tracking-[0.36px]">
                {parseResponse(response?.specialization)}
              </p>
            </div>

            <Divider variant="dotted" size="md" color={"m-cyan"} />

            {/* education */}
            <div className="flex items-center gap-x-2">
              <span className=" text-graytext leading-[30px] text-[18px] font-extrabold  tracking-[0.32px]">
                Education:
              </span>
              <p className=" capitalize text-graytext leading-[30px] text-[18px] font-medium  tracking-[0.36px]">
                {parseResponse(response?.degree)}
              </p>
            </div>

            <Divider variant="dotted" size="md" color={"m-cyan"} />

            <div className="flex items-center gap-x-2">
              <span className=" text-graytext leading-[30px] text-[18px] font-extrabold  tracking-[0.32px]">
                Course of Study:
              </span>
              <p className=" capitalize text-graytext leading-[30px] text-[18px] font-medium  tracking-[0.36px]">
                {parseResponse(response?.courseOfStudy)}
              </p>
            </div>

            <Divider variant="dotted" size="md" color={"m-cyan"} />

            <div className="flex items-center gap-x-2">
              <span className=" text-graytext leading-[30px] text-[18px] font-extrabold  tracking-[0.32px]">
                University:
              </span>
              <p className=" capitalize text-graytext leading-[30px] text-[18px] font-medium  tracking-[0.36px]">
                {parseResponse(response?.university)}
              </p>
            </div>

            <Divider variant="dotted" size="md" color={"m-cyan"} />
          </section>
        </section>
      </GridCol>
      <GridCol  pos={"relative"} span={{ base: 12, md: 5 }}>
        <section className="">
          <Image
            src={response?.profilePicture as string}
            alt="doctor-profile-picture"
            quality={100}
            width={470}
            height={447}
            className=" rounded-lg block mx-auto"
          />
          <Image
            src={PuzzleImage}
            width={163}
            height={220}
            alt="puzzle"
            className=" absolute -top-[45px] block -right-[55px]  z-30"
          />
        </section>
      </GridCol>
    </Grid>
  );
};

export default DoctorDetails;
