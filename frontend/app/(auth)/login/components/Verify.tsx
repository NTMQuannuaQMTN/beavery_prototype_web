"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";

interface VerifyProps {
  email: string;
  otp: string[];
  setOtp: (otp: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToEmail: () => void;
  onResendOtp: () => void;
  isLoading: boolean;
}

export default function Verify({
  email,
  otp,
  setOtp,
  onSubmit,
  onBackToEmail,
  onResendOtp,
  isLoading,
}: VerifyProps) {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendClick = () => {
    onResendOtp();
    setCountdown(30); // 30 seconds countdown
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const isOtpComplete = otp.length === 6 && otp.every(digit => digit.trim() !== "");

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              disabled={isLoading}
              className="h-14 w-14 rounded-lg border border-graytext text-center text-2xl font-bold text-black focus:border-main focus:outline-none focus:ring-2 focus:ring-main/20 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          ))}
        </div>
      </div>
      <Button 
        type="submit" 
        className={isLoading || !isOtpComplete ? "bg-disabled" : ""} 
        disabled={isLoading || !isOtpComplete}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
      <div className="w-full text-center text-sm text-graytext font-medium">
        Didn't receive the code?{" "}
        <button
          type="button"
          onClick={handleResendClick}
          disabled={isLoading || countdown > 0}
          className="transition-all duration-100 text-black cursor-pointer hover:font-bold disabled:cursor-not-allowed disabled:text-graytext disabled:hover:font-medium"
        >
          Resend OTP
        </button>
        {countdown > 0 && <span className="ml-1 text-graytext">in {countdown}s</span>}
      </div>
    </form>
  );
}

