"use client";
import {
  Checkbox,
  Combobox,
  ComboboxProps,
  Group,
  Input,
  Pill,
  PillsInput,
  PillsInputProps,
  useCombobox,
} from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

type MultiSelectCheckboxProps = ComboboxProps & PillsInputProps & {
    value: string[];
    label: string;
  setValue: Dispatch<SetStateAction<string[]>>;
  data: {label:string, value:string}[] ;
};
export function CustomMultiSelectCheckbox(Props: MultiSelectCheckboxProps) {
  const { value, setValue, data, ...rest } = Props;
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const handleValueSelect = (val: string) =>
    setValue((current) =>
      current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val]
    );

  const handleValueRemove = (val: string) =>
    setValue((current) => current.filter((v) => v !== val));

  const values = value?.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {data?.find((v) => v.value == item)?.label || item}
    </Pill>
  ));

  const options = data.map((item) => (
    <Combobox.Option value={item.value} key={item.value} active={value.includes(item.value)}>
      <Group gap="sm">
        <Checkbox
          checked={value.includes(item.value)}
          onChange={() => {}}
          aria-hidden
          tabIndex={-1}
          style={{ pointerEvents: "none" }}
        />
        <span>{item.label}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
          withinPortal={false}
          {...rest}
    >
      <Combobox.DropdownTarget>
        <PillsInput {...rest} pointer onClick={() => combobox.toggleDropdown()}>
          <Pill.Group>
            {values.length > 0 ? (
              values
            ) : (
              <Input.Placeholder>Pick one or more values</Input.Placeholder>
            )}

            <Combobox.EventsTarget>
              <PillsInput.Field
                type="hidden"
                onBlur={() => combobox.closeDropdown()}
                onKeyDown={(event) => {
                  if (event.key === "Backspace") {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
