import { ButtonProps, ComboboxData, CSSProperties } from "@mantine/core";
import { DateInputStylesNames, TimePickerProps } from "@mantine/dates";

export type INPUTFORMPROPS =
  | {
      label: string;
      type: "text";
      size?: "xs" | "sm" | "md" | "lg" | "xl";
      placeholder?: string;
      required?: boolean;
      readOnly?: boolean;
      value?: string;
      w?: string | number;
      rightSection?: React.ReactNode;
      disabled?: boolean;
      error?: React.ReactNode;
      leftSection?: React.ReactNode;
      radius?: string | number;
      rightSection?: React.ReactNode;
      withAsterisk?: boolean;
      key?: React.Key | null | undefined;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }
  | {
      label: string;
      type: "password";
      size?: "xs" | "sm" | "md" | "lg" | "xl";
      placeholder?: string;
      required?: boolean;
      value?: string;
      disabled?: boolean;
      error?: React.ReactNode;
      leftSection?: React.ReactNode;
      radius?: string | number;
      rightSection?: React.ReactNode;
      withAsterisk?: boolean;
      key?: React.Key | null | undefined;
      getinput?: GetInputPropsReturnType;
    }
  | {
      label: string;
      labelPosition?: "left" | "right";
      className?: string;
      color?: "m-blue" | "m-orange" | "m-cyan" | "m-gray" | "m-background";
      type: "checkbox";
      size?: "xs" | "sm" | "md" | "lg" | "xl";
      required?: boolean;
      disabled?: boolean;
      error?: React.ReactNode;
      leftSection?: React.ReactNode;
      radius?: string | number;
      rightSection?: React.ReactNode;
      key?: React.Key | null | undefined;
    }
  | {
      label: string;
      placeholder?: string;
      className?: string;
      type: "phone_no";
      required?: boolean;
      disabled?: boolean;
      error?: React.ReactNode;
      key?: React.Key | null | undefined;
      onChange: () => void;
    }
  | {
      label: string;
      placeholder?: string;
      className?: string;
      type: "select";
      size?: "xs" | "sm" | "md" | "lg" | "xl";
      required?: boolean;
      disabled?: boolean;
      error?: React.ReactNode;
      data: ComboboxData;
      radius?: string | number;
      key?: React.Key | null | undefined;
      onChange: () => void;
    }
  | {
      label?: string;
      placeholder?: string;
      className?: string;
      type: "datepicker";
      size?: "xs" | "sm" | "md" | "lg" | "xl";
      required?: boolean;
      disabled?: boolean;
      error?: React.ReactNode;
      radius?: string | number;
      dateParser?:
        | ((value: string) => DateStringValue | Date | null)
        | undefined;
      key?: React.Key | null | undefined;
      valueFormat?: "YYYY MMMM DD" | "YYYY-MM-DD" | "YYYY/MM/DD" | "yyyy-mm-dd";
      onChange?: () => void;
      styles?: Partial<Record<DateInputStylesNames, CSSProperties>>;
    }
  | {
      label: string;
      type: "textarea";
      size?: "xs" | "sm" | "md" | "lg" | "xl";
      placeholder?: string;
      required?: boolean;
      value?: string;
      disabled?: boolean;
      error?: React.ReactNode;
      leftSection?: React.ReactNode;
      radius?: string | number;
      rightSection?: React.ReactNode;
      withAsterisk?: boolean;
      key?: React.Key | null | undefined;
    }
  | {
      type: "fileInput";
      setFile: React.Dispatch<React.SetStateAction<File | null>>;
      file: File | null | StaticImageData;
      allowPicture?: boolean;
      label?: string;
    }
  | ({
      type: "timepicker";
    } & TimePickerProps);

export type CUSTOMSUBMITBTNPROPS = ButtonProps &{
    text: string;
    type: "submit" | "button" | "reset";
}
