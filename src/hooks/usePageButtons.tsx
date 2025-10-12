"use client";
import { useMedStore } from "@/providers/med-provider";
import { HeaderButtonsType } from "@/types/store.types";
import { useEffect } from "react";

const usePageButtons = (btnArray: HeaderButtonsType[] | null) => {
  const { setPageButtons, clearPageButtons } = useMedStore((store) => store);
  useEffect(() => {
    setPageButtons(btnArray);

    return () => clearPageButtons();
  }, []);

  return null;
};

export default usePageButtons;
