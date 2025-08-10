"use client";
import { createCancellationAction } from "@/lib/actions/actions";
import { AppointmentStatus, RefundAppointmentParams, refundStatus } from "@/types/actions.types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useCancelAppointment = (status?: refundStatus | undefined) => {
  const [showProcessing, setShowProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const simulateProcessing = async (stats?: string) => {
    // Step 1: Cancel appointment
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setActiveStep(1);

    // Step 2: Process refund
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setActiveStep(2);

    if (stats == "success") {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setActiveStep(3);
    }
  };

  useEffect(() => {
    if (status == 'pending') {
       setActiveStep(2);
    }
    if (status == 'approved') {
        simulateProcessing("success");
    }
  }, []);

  const handleCancelAction = async (
    params: RefundAppointmentParams,
    appointmentStatus: AppointmentStatus
  ) => {
    try {
      const response = await createCancellationAction(params, appointmentStatus);
      if (response.code != 201) {
        toast.error(response.message);
        return;
      }
      toast.success("Appointment cancellation successful!");
      setShowProcessing(true);
      await simulateProcessing();
    } catch (error) {
      console.log("Cancellation failed:", error);
      setShowProcessing(false);
    }
  };

  return {
    handleCancelAction,
    showProcessing,
    activeStep,
    showSuccess,
    setShowSuccess,
  };
};

export default useCancelAppointment;
