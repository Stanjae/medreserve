"use client";
import useGetDoctorsFilterQuery from "@/hooks/useGetDoctorsFilterQuery";
import React, { useEffect } from "react";
import BookDoctorCard from "../../cards/BookDoctorCard";
import { toast } from "sonner";
import CustomPagination from "../../molecules/pagination/CustomPagination";
import MedReserveLoader from "../../loaders/MedReserveLoader";
import EmptyState from "../../boxes/EmptyBox";

const FilterableDoctorList = () => {
  const { data, error, isLoading, isPlaceholderData, isSuccess, isFetching } =
    useGetDoctorsFilterQuery();

  const loadingState = isLoading || isFetching;

  useEffect(() => {
    if (error) toast.error(error?.message);
  }, [error]);

  if (data?.project?.length === 0)
    return (
      <EmptyState
        minHeight="50vh"
        showPaper={false}
        title="No appointments found"
        description="Be the first to schdule an appointment"
      />
    );

  return (
    <div>
      {loadingState && (
        <div className="flex items-center justify-center">
          <MedReserveLoader />
        </div>
      )}
      {!loadingState &&
        isSuccess &&
        data?.project?.map((item) => (
          <BookDoctorCard item={item} key={item?.$id} />
        ))}
      {!loadingState && data && (
        <CustomPagination
          total={data?.total as number}
          dataHasMore={data?.hasMore as boolean}
          isPlaceholderData={isPlaceholderData}
        />
      )}
    </div>
  );
};

export default FilterableDoctorList;
