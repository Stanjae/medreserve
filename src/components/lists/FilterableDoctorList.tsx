'use client'
import useGetDoctorsFilterQuery from '@/hooks/useGetDoctorsFilterQuery'
import React, { useEffect } from 'react'
import BookDoctorCard from '../cards/BookDoctorCard';
import { toast } from 'sonner';
import CustomPagination from '../pagination/CustomPagination';
import MedReserveLoader from '../loaders/MedReserveLoader';
import EmptyState from '../boxes/EmptyBox';

const FilterableDoctorList = () => {
  const { data, error, isLoading, isPlaceholderData, isSuccess, isFetching } = useGetDoctorsFilterQuery();

  useEffect(() => {
    if (error) toast.error(error?.message);
  }, [error]);

    if(data?.project?.length === 0) return <EmptyState minHeight="50vh" showPaper={false} title="No appointments found" description="Be the first to schdule an appointment" />

  return (
    <div>
      {(isLoading || isFetching) && <div className="flex items-center justify-center"><MedReserveLoader /></div>}
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