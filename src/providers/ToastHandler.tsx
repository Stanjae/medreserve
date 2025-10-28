// components/toast-handler.tsx
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";

export default function ToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shownToast = useRef(false);

  useEffect(() => {
    const message = searchParams.get("message");

    if (message && !shownToast.current) {
      shownToast.current = true;

      const toastConfig =
        TOAST_MESSAGES[message as keyof typeof TOAST_MESSAGES];

      if (toastConfig) {
        const { type, message: text } = toastConfig;

        switch (type) {
          case "error":
            toast.error(text);
            break;
          case "success":
            toast.success(text);
            break;
          case "info":
            toast.info(text);
            break;
        }

        // Clean up URL without triggering navigation
        const url = new URL(window.location.href);
        url.searchParams.delete("message");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [searchParams, router]);

  return null;
}
