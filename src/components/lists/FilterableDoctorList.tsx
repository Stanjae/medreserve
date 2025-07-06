'use client'
import useGetDoctorsFilterQuery from '@/hooks/useGetDoctorsFilterQuery'
import React, { useEffect } from 'react'
import BookDoctorCard from '../cards/BookDoctorCard';
import { toast } from 'sonner';
import { Loader } from '@mantine/core';
import CustomPagination from '../pagination/CustomPagination';

const FilterableDoctorList = () => {
  const { data, error, isLoading, isPlaceholderData, isSuccess } = useGetDoctorsFilterQuery();

  useEffect(() => {
    if (error) toast.error(error?.message);
  }, [error]);

  return (
    <div>
      {isLoading && <Loader className="mx-auto" type="bars" />}
      {isSuccess &&
        data?.project?.map((item) => <BookDoctorCard item={item} key={item?.$id} />)}
      {!isLoading && (
        <CustomPagination total={data?.total as number}
          dataHasMore={data?.hasMore as boolean}
          isPlaceholderData={isPlaceholderData}
        />
      )}
    </div>
  );
}

export default FilterableDoctorList