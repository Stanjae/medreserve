/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useState, useCallback } from "react";
import { z } from "zod";

interface UseSmartFormOptions<T> {
  initialValues: T;
  schema?: z.ZodSchema<T>;
  ignoreFields?: string[];
}

export function useMedReserveForm<T extends Record<string, any>>({
  initialValues,
  schema,
  ignoreFields = [],
}: UseSmartFormOptions<T>) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: schema ? zodResolver(schema) : undefined,
  });

  const [initialData, setInitialData] = useState<T>(
    structuredClone(initialValues)
  ); // Initialize with initialValues instead of null
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(
    (data: T) => {
      setInitialData(structuredClone(data));
      form.setValues(data);
      form.clearErrors();
    },
    [form]
  );

  const getChanges = useCallback(() => {
    const changes: any = {};
    const current = form.getValues(); // Use getValues() for uncontrolled mode

    const findChanges = (initial: any, current: any, path = "") => {
      for (const key in current) {
        const fullPath = path ? `${path}.${key}` : key;

        // Skip ignored fields - more robust checking
        if (
          ignoreFields.some(
            (ignored) =>
              fullPath === ignored || fullPath.startsWith(ignored + ".")
          )
        ) {
          continue;
        }

        if (
          typeof current[key] === "object" &&
          current[key] !== null &&
          !Array.isArray(current[key])
        ) {
          findChanges(initial?.[key] || {}, current[key], fullPath);
        } else if (initial?.[key] !== current[key]) {
          // Build nested object structure
          const keys = fullPath.split(".");
          let target = changes;

          for (let i = 0; i < keys.length - 1; i++) {
            if (!target[keys[i]]) target[keys[i]] = {};
            target = target[keys[i]];
          }

          target[keys[keys.length - 1]] = current[key];
        }
      }
    };

    findChanges(initialData, current);
    return changes;
  }, [form, initialData, ignoreFields]);

  const hasChanges = useCallback(() => {
    return Object.keys(getChanges()).length > 0;
  }, [getChanges]);

  const saveChanges = useCallback(
    async (saveFn: (changes: Partial<T>) => Promise<any>) => {
      if (!hasChanges()) {
        return { success: true, message: "No changes to save" };
      }

      if (!form.isValid()) {
        return { success: false, error: "Please fix validation errors" };
      }

      setIsLoading(true);
      try {
        const changes = getChanges();
        await saveFn(changes);
        setInitialData(structuredClone(form.getValues())); // Use getValues() for uncontrolled mode
        return { success: true, changes };
      } catch (error) {
        return { success: false, error };
      } finally {
        setIsLoading(false);
      }
    },
    [form, hasChanges, getChanges]
  );

  const reset = useCallback(() => {
    form.setValues(structuredClone(initialData));
    form.clearErrors();
  }, [form, initialData]);

  return {
    form,
    loadData,
    getChanges,
    hasChanges,
    saveChanges,
    reset,
    isLoading,
  };
}
