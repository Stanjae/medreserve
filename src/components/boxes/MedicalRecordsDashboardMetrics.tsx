'use client';
import { Grid, GridCol } from '@mantine/core';
import React, { useMemo } from 'react'
import DashboardMetricCard from '../cards/DashboardMetricCard';
import { medicalRecordsMetricsInfo } from '@/constants';

type Props = {
  data: {
    total: number;
    active: number;
    doctorsVisited: number;
    lastVisit: string;
  } | undefined;
  isLoading: boolean;
};

const MedicalRecordsDashboardMetrics = ({data, isLoading}:Props) => {
    
    const CardsInfo = useMemo(
      () =>
        medicalRecordsMetricsInfo.map((item) => ({
          ...item,
          count: data ? (data[item.value as keyof typeof data] ?? 0) : 0,
        })),
      [data]
    );
  return (
    <div className='space-y-3'>
          <Grid overflow='hidden'>
              {CardsInfo?.map((item, index) => (
                  <GridCol key={index} span={{ base: 12, md: 6, lg: 3 }}>
                      <DashboardMetricCard loading={isLoading} item={item } />
                  </GridCol>
              ))}
          </Grid>
    </div>
  )
}

export default MedicalRecordsDashboardMetrics;