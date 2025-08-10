'use client';
import { useMedStore } from '@/providers/med-provider';
import { Grid, GridCol } from '@mantine/core';
import React, { useMemo } from 'react'
import DashboardMetricCard from '../cards/DashboardMetricCard';
import useGetPatientDashboardMetrics from '@/hooks/useGetPatientDashboardMetrics';
import { dashboardMetricsCardInfo } from '@/constants';

const DashboardMetrics = () => {
    const { credentials } = useMedStore(store => store)
    const { data, isLoading } = useGetPatientDashboardMetrics(credentials?.databaseId as string)
    
    const CardsInfo = useMemo(
      () =>
        dashboardMetricsCardInfo.map((item) => ({
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

export default DashboardMetrics