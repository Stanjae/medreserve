"use client";
import { Box, Button, Group } from "@mantine/core";
import React from "react";
import CustomInput from "../molecules/inputs/CustomInput";
import { doctorCategories } from "@/constants";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import useDoctorMasonryList from "@/hooks/useDoctorMasonryList";
import DoctorMasonryCard from "../cards/DoctorMasonryCard";
import MedReserveLoader from "../loaders/MedReserveLoader";

const AllDoctorsMasonry = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    ""
  );
  const { data, isLoading, isSuccess } = useDoctorMasonryList(
    selectedCategory as string
  );

  return (
    <Box className="space-y-10">
      <Group justify="center">
        <Button
          variant="secondary"
          radius={35}
          size="lg"
          disabled={selectedCategory === ""}
          onClick={() => setSelectedCategory(null)}
        >
          All Doctors
        </Button>
        <CustomInput
          type="select"
          size="lg"
          value={selectedCategory}
          placeholder=" Doctor's Category"
          onChange={(e) => setSelectedCategory(e as string)}
          radius={35}
          data={doctorCategories}
        />
      </Group>
      {isLoading && (
        <div className=" flex w-full justify-center items-center">
          <MedReserveLoader />
        </div>
      )}
      <div>
        {isSuccess && (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
          >
            <Masonry style={{ gap: "24px" }}>
              {data &&
                data?.map((doctor, index) => (
                  <DoctorMasonryCard key={index} item={doctor} />
                ))}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </div>
    </Box>
  );
};

export default AllDoctorsMasonry;
