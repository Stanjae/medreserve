"use client";
import React, { useEffect } from "react";
import { toast } from "sonner";
import CustomPagination from "../../molecules/pagination/CustomPagination";
import MedReserveLoader from "../../loaders/MedReserveLoader";
import useSearchForAppointments from "@/hooks/admin/useSearchForAppointments";
import SearchAppointmentCard from "../../cards/SearchAppointmentCard";
import EmptyState from "../../boxes/EmptyBox";

const FilterableAppointmentList = () => {
  const { data, error, isLoading, isPlaceholderData, isSuccess, isFetching } =
    useSearchForAppointments();

  useEffect(() => {
    if (error) toast.error(error?.message);
  }, [error]);

  if (isFetching)
    return (
      <div className="flex items-center justify-center">
        <MedReserveLoader />
      </div>
    );

  if (data?.project?.length === 0)
    return (
      <EmptyState
        minHeight="50vh"
        showPaper={false}
        title="No appointments found"
        description="Be the first to look for an appointment"
      />
    );

  return (
    <div className="space-y-7">
      {isSuccess &&
        data?.project?.map((item) => (
          <SearchAppointmentCard appointment={item} key={item?.$id} />
        ))}
      {!isLoading && data?.project && (
        <CustomPagination
          total={data?.total as number}
          dataHasMore={data?.hasMore as boolean}
          isPlaceholderData={isPlaceholderData}
        />
      )}
    </div>
  );
};

export default FilterableAppointmentList;
