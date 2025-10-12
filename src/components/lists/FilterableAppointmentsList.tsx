"use client";
import React, { useEffect } from "react";
import { toast } from "sonner";
import CustomPagination from "../pagination/CustomPagination";
import MedReserveLoader from "../loaders/MedReserveLoader";
import useSearchForAppointments from "@/hooks/admin/useSearchForAppointments";
import SearchAppointmentCard from "../cards/SearchAppointmentCard";
import EmptyState from "../boxes/EmptyBox";

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
  
  if(data?.project?.length === 0) return <EmptyState title="No appointments found" description="No appointments found" />
  
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
