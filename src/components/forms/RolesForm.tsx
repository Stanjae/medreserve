"use client";
import React, { useEffect, useState } from "react";
import CustomInput from "../inputs/CustomInput";
import {
  Accordion,
  Button,
  Checkbox,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Paper,
  Text,
} from "@mantine/core";
import { AllPermissions, PermissionKeys } from "@/types/store";
import { DefaultRoles, ModifiedRoles } from "../../../types/appwrite";
import { parseResponse, stringToSlug } from "@/utils/utilsFn";
import DefaultPermissons from "../../lib/api/roles.json";

type RoleFormProps = {
  objectKeys: string[] | undefined;
  data: ModifiedRoles | undefined;
  isEdited: boolean;
  allData: DefaultRoles | undefined;
  setAllData: React.Dispatch<React.SetStateAction<DefaultRoles | undefined>>;
};

const RolesForm = ({ objectKeys, data, isEdited, setAllData }: RoleFormProps) => {
  const [defaultOpen, setDefaultOpen] = useState<string[]>();
  const [selectedPermissions, setSelectedPermissions] =
    useState<AllPermissions>({});
  const [permissionType, setPermissionType] = useState<string>("");
  const [priority, setPriority] = useState<number | string>();

  useEffect(() => {
    if (isEdited) {
      setPermissionType(data?.type as string);
      setSelectedPermissions(data?.permissions as unknown as AllPermissions);
      setPriority(data?.priority);
    } else {
      setPermissionType("");
      setSelectedPermissions(DefaultPermissons.newUser as AllPermissions);
      setPriority(1);
    }
    return () => {
      setSelectedPermissions({});
      setPermissionType("");
      setPriority(0);
    };
  }, [
    isEdited,
    data,
  ]);
    
   useEffect(() => {
        if( selectedPermissions && permissionType && priority){
            setAllData({
                type: stringToSlug(permissionType) as PermissionKeys,
                priority: priority as number,
                permissions: JSON.stringify(selectedPermissions)
            })
        }
    },[selectedPermissions, permissionType, priority, setAllData]);

  const handlePermissionItemChange = (
    sectionName: string,
    itemValue: string,
    isChecked: boolean
  ) => {
    setSelectedPermissions((prev: AllPermissions) => {
      const result = prev[sectionName]?.map((item) => {
        if (item.value === itemValue) {
          return { ...item, status: isChecked };
        }
        return item;
      });

      return { ...prev, [sectionName]: result };
    });
  };

  const handleAllPermissionsChange = (isChecked: boolean) => {
    setSelectedPermissions((prev: AllPermissions) => {
      const result = Object.keys(prev).reduce((acc, key) => {
        acc[key] = prev[key]?.map((item) => ({ ...item, status: isChecked }));
        return acc;
      }, {} as AllPermissions);
      return result;
    });
  };

  const handleSectiionPermissionChange = (
    sectionName: string,
    isChecked: boolean
  ) => {
    setSelectedPermissions((prev: AllPermissions) => {
      const result = prev[sectionName]?.map((item) => ({
        ...item,
        status: isChecked,
      }));
      return { ...prev, [sectionName]: result };
    });
  };

  const isAllPermissionsSelected = Object.values(
    selectedPermissions && selectedPermissions
  ).every((items) => items?.every((item) => item.status));
  return (
    <div>
      <section className="max-w-[calc(100%-560px)] mx-auto space-y-4">
        <Grid overflow="hidden">
          <GridCol span={{ base: 12, md: 6, lg: 8 }}>
            <CustomInput
              type="text"
              label="Give this role a name"
                          size="md"
                          max={20}
              value={parseResponse(permissionType)}
              onChange={(e) => setPermissionType(e.target.value)}
            />
          </GridCol>

          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <NumberInput
              label="Priority Level"
              size="md"
              value={priority}
              onChange={setPriority}
              allowNegative={false}
              min={0}
              max={5}
              allowDecimal={false}
              clampBehavior="strict"
            />
          </GridCol>
        </Grid>

        <div>
          <Text>Select permissions for this role</Text>
          <Paper p={"16px"} radius="md">
            <Group justify="space-between">
              <Checkbox
                checked={isAllPermissionsSelected}
                onChange={(e) =>
                  handleAllPermissionsChange(e.currentTarget.checked)
                }
                size="md"
                label="Select permissions for this role"
              />
              <Button
                onClick={() =>
                  setDefaultOpen((prev) => (prev?.length ? [] : objectKeys))
                }
                size="md"
                color="m-blue"
                variant="transparent"
              >
                {defaultOpen?.length ? "Collapse All" : "Expand All"}
              </Button>
            </Group>
            <Divider my="xs" />
            <Accordion
              variant="filled"
              multiple
              value={defaultOpen}
              onChange={setDefaultOpen}
            >
              {objectKeys?.map((itemy, index) => {
                const newRef = selectedPermissions && selectedPermissions?.[itemy];
                const total = newRef?.length ?? 0;
                const checkedCount =
                  newRef?.filter((item) => item.status).length ?? 0;

                const allChecked = total === checkedCount;
                return (
                  <Accordion.Item key={index} value={itemy}>
                    <Accordion.Control>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          size="md"
                          label={itemy}
                          checked={allChecked}
                          onChange={(e) =>
                            handleSectiionPermissionChange(
                              itemy,
                              e.currentTarget.checked
                            )
                          }
                        />
                        <Text className="ml-auto pr-3">
                          {checkedCount} / {total}
                        </Text>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <ul className="flex flex-wrap gap-2">
                        {selectedPermissions &&selectedPermissions?.[itemy]?.map(
                          (
                            item: {
                              label: string;
                              status: boolean;
                              value: string;
                            },
                            index: number
                          ) => (
                            <li key={index} className=" w-[45%]  grow">
                              <Checkbox
                                color="m-blue"
                                size="sm"
                                checked={item?.status}
                                label={item?.label}
                                onChange={(e) =>
                                  handlePermissionItemChange(
                                    itemy,
                                    item?.value,
                                    e.currentTarget.checked
                                  )
                                }
                              />
                            </li>
                          )
                        )}
                      </ul>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Paper>
        </div>
      </section>
    </div>
  );
};

export default RolesForm;
