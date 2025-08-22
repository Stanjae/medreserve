"use client";
import { generateSecureOTP } from "@/utils/utilsFn";
import { Button } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

type Props = {
    isOtpActive: boolean
    data: { email: string; username: string; password: string; };
}

export default function CountdownTimer({isOtpActive, data}: Props) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedEndTime = localStorage.getItem("countdownEndTime");
    const savedIsActive = localStorage.getItem("countdownIsActive");

    if (savedEndTime && savedIsActive === "true") {
      const endTime = parseInt(savedEndTime);
      const now = Date.now();

      if (now < endTime) {
        // Countdown is still running
        const remaining = Math.ceil((endTime - now) / 1000);
        setTimeLeft(remaining);
        setIsActive(true);
      } else {
        // Countdown has finished
        setTimeLeft(0);
        setIsActive(false);
        localStorage.removeItem("countdownEndTime");
        localStorage.removeItem("countdownIsActive");
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            localStorage.removeItem("countdownEndTime");
            localStorage.removeItem("countdownIsActive");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000) as unknown as null;
    } else {
      clearInterval(intervalRef.current as unknown as NodeJS.Timeout);
    }
  
    return () => clearInterval(intervalRef.current as unknown as NodeJS.Timeout);
  }, [isActive, timeLeft]);

  const startCountdown = () => {
    const duration = 3 * 60; 
    const endTime = Date.now() + duration * 1000;

    setTimeLeft(duration);
    setIsActive(true);

    // Save to localStorage
    localStorage.setItem("countdownEndTime", endTime.toString());
    localStorage.setItem("countdownIsActive", "true");
    };
    
    useEffect(() => {
      if (isOtpActive) {
          startCountdown();
      }
    },[isOtpActive]);

  const resetCountdown = () => {
    setTimeLeft(0);
    setIsActive(false);
    clearInterval(intervalRef.current as unknown as NodeJS.Timeout);
    localStorage.removeItem("countdownEndTime");
    localStorage.removeItem("countdownIsActive");
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };
    
    const handleResendOtp = async () => { 
            const otpCode = generateSecureOTP();
        const sendOtpVerificationAdmin = await fetch(
          "/api/medreserve/send-otp-mail",
          {
            method: "POST",
            body: JSON.stringify({
              email: data?.email,
              username: data?.username,
              otpCode: otpCode,
            }),
          }
        );
        const emailResponse = await sendOtpVerificationAdmin.json();
        if (emailResponse?.code !== 200) {
          toast.error(emailResponse?.message);
          return;
        }
        toast.success("Please enter the OTP sent to your email");
        resetCountdown();
        startCountdown();
    }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        onClick={handleResendOtp}
        disabled={isActive}
              size="sm"
              variant="subtle"
      >
        Resend OTP
      </Button>
      <div className="text-sml  font-bold text-blue-600">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
}
