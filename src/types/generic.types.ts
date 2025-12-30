import { TMetricCardStatus } from "./actions.types";

export type GETADDBYPARAMS =
  | "day"
  | "week"
  | "month"
  | "year"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

export type DayUnits =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "date"
  | "week"
  | "month"
  | "year";

export type TMetricCard = {
  label: string;
  value: string;
  loading?: boolean;
  count?: string | number;
  subLabel?: string;
  status?: TMetricCardStatus | null;
  }
