'use client'
import React from 'react'
import { AnimatedTestimonial } from '../animated/AnimatedTestimonial';
import useGetDoctorsReviews from '@/hooks/useGetDoctorsReviews';
import MedReserveLoader from '../loaders/MedReserveLoader';
import EmptyState from './EmptyBox';
import { Button } from '@mantine/core';
import Link from 'next/link';

const ReviewsBox = ({doctorId}:{doctorId:string}) => {
    const { data, isLoading } = useGetDoctorsReviews(doctorId);
    
    if (isLoading) return <div className=" flex justify-center items-center"><MedReserveLoader /></div>
    
    if (!data) return <EmptyState title="No reviews found" description="Be the first to leave a review" Button={<Button  component={Link} href={'#reviews'}>Leave a review</Button>} />
  return (data && <AnimatedTestimonial testimonials={ data} autoplay/>
  )
}

export default ReviewsBox