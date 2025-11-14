import { getDoctorDetails } from "@/lib/actions/getActions";
import { Divider, Grid, GridCol, Group, Rating } from "@mantine/core";
import Image from "next/image";
import React from "react";
import PuzzleImage from "../../../public/puzzle-1.png";
import { parseResponse } from "@/utils/utilsFn";

const DoctorDetails = async ({ doctorId }: { doctorId: string }) => {
  const response = await getDoctorDetails(doctorId);

  const ratingTotal = response?.reviewsId?.reduce((acc, val) => Number(acc) + Number(val?.rating), 0) || 1;
  const totatlCount = response?.reviewsId?.length || 1;
  const averageRating = (ratingTotal / totatlCount).toFixed(1) || 1 ;

  return (
    <Grid overflow="hidden">
      <GridCol className=" md:pr-[82px] px-6" span={{ xs: 12, md: 7 }} order={{ base: 2, md: 1 }}>
        <section className=" space-y-[25px]">
          <h3 className=" text-secondary md:leading-[70px] leading-[50px] font-extrabold md:text-[50px] text-[40px]  tracking-[0.32px]">
            Dr. {response?.fullname}
          </h3>

          <div>
            <section className="flex items-center gap-x-4">
              <Rating value={averageRating as number} fractions={2} readOnly />
              <div className=" text-secondary leading-[30px] font-extrabold  tracking-[0.32px]">
                {Number(averageRating).toFixed(1)} / 5.0
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
      <GridCol
        pos={"relative"}
        span={{ base: 12, md: 5 }}
        order={{ base: 1, md: 2 }}
        className=" mt-[140px] md:mt-0 "
      >
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
            className=" absolute md:-top-[45px] top-[-33%] block md:-right-[55px] right-[5%]  z-30 md:w-[163px] md:h-[220px] w-[133px] h-[190px]"
          />
        </section>
      </GridCol>
    </Grid>
  );
};

export default DoctorDetails;
