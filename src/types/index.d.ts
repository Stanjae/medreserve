import {
  ButtonProps,
  CheckboxProps,
  PasswordInputProps,
  SelectProps,
  TextareaProps,
  TextInputProps,
} from "@mantine/core";
import { DateInputProps, DateInputStylesNames, TimePickerProps } from "@mantine/dates";

type CTextInput = {
  type: "text";
} & TextInputProps;

type CPassword = PasswordInputProps & {
  type: "password";
  key?: React.Key | null | undefined;
  //getinput?: GetInputPropsReturnType;
};

type CTextarea = TextareaProps & {
  type: "textarea";
  key?: React.Key | null | undefined;
};

type CTimepicker = TimePickerProps & {
  type: "timepicker";
};

type CFileInput = {
  type: "fileInput";
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  file: File | null | StaticImageData;
  allowPicture?: boolean;
  label?: string;
};

type CDateInput = DateInputProps & {
  type: "datepicker";
  dateParser?: ((value: string) => DateStringValue | Date | null) | undefined;
  key?: React.Key | null | undefined;
  valueFormat?: "YYYY MMMM DD" | "YYYY-MM-DD" | "YYYY/MM/DD" | "yyyy-mm-dd";
  //onChange?: () => void; // Consider adding event param if needed
  styles?: Partial<Record<DateInputStylesNames, React.CSSProperties>>;
};

type CPhoneInput = {
  label: string;
  placeholder?: string;
  className?: string;
  type: "phone_no";
  required?: boolean;
  disabled?: boolean;
  error?: React.ReactNode;
  key?: React.Key | null | undefined;
  onChange: (val?: E164Number | undefined) => void;
  value?: string;
};

type CCheckBox = CheckboxProps & {
  type: "checkbox";
  key?: React.Key | null | undefined;
};

type CSelect = SelectProps & {
  type: "select";
};

type CTextInput2 = CTextInput | CPassword;
type CTimeAndDate = CTimepicker | CDateInput;

export type INPUTFORMPROPS = CTextInput2 | CTimeAndDate | CTextarea | CFileInput | CPhoneInput | CCheckBox | CSelect;

export type CUSTOMSUBMITBTNPROPS = ButtonProps & {
  text: string;
  type?: "submit" | "button" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export type GETADDBYPARAMS =
  | "day"
  | "week"
  | "month"
  | "year"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

export type DayUnits = "second" | "minute" | "hour" | "day" | "date" | "week" | "month" | "year";

export interface UseModalsStackReturnType<T extends string> {
  // Current opened state of each modal
  state: Record<T, boolean>;

  // Opens modal with the given id
  open: (id: T) => void;

  // Closes modal with the given id
  close: (id: T) => void;

  // Toggles modal with the given id
  toggle: (id: T) => void;

  // Closes all modals within the stack
  closeAll: () => void;

  // Returns props for modal with the given id
  register: (id: T) => {
    opened: boolean;
    onClose: () => void;
    stackId: T;
  };
}
