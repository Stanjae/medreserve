'use client';
import React from 'react'
import {
  Carousel,
  CarouselProps,
  CarouselStylesNames,
} from "@mantine/carousel";
import { CSSProperties, MantineTheme } from '@mantine/core';

type Props = {
  children: React.ReactNode;
  styles?:
    | Partial<Record<CarouselStylesNames, CSSProperties>>
    | ((
        theme: MantineTheme,
        props: CarouselProps,
        ctx: unknown
      ) => Partial<Record<CarouselStylesNames, CSSProperties>>)
    | undefined;
} & CarouselProps;

const MedReserveCarousel = ({children, styles, ...props}:Props) => {
  return (
      <Carousel {...props} styles={styles}>
          {children}
    </Carousel>
  )
}

export default MedReserveCarousel