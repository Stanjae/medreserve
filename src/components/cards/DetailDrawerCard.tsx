"use client";
import { Grid, Paper } from "@mantine/core";
import React from "react";
import CustomInput from "../inputs/CustomInput";

/**
 * DetailDrawerCard
 *
 * A simple component that renders a card with details
 *
 * @returns {JSX.Element} A JSX element representing the card
 */

type DetailDrawerCardProps = {
  rowData: {
    key: string;
    value: string | number;
    index: number;
    type: "text";
    cols?: number;
    icon?: React.ReactNode;
  }[];
};

const DetailDrawerCard = ({ rowData }: DetailDrawerCardProps) => {
  return (
    <Paper p={20} radius="lg" shadow="md">
      <Grid>
        {rowData.map((item, index) => (
          <Grid.Col key={index} span={item.cols}>
            <CustomInput
              leftSection={item.icon}
              styles={{
                label: { fontSize: 13, textTransform: "capitalize" },
                input: { color: "var(--mantine-color-m-gray-8)" },
              }}
              readOnly
              radius={35}
              size="md"
              value={item.value}
              label={item.key}
              type={item.type}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
};

export default DetailDrawerCard;
