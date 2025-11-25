"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "otp" | "welcome">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // Automatically create user if they don't exist
        },
      });

      if (error) throw error;

      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const otpCode = otp.join("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "email",
      });

      if (error) throw error;

      // Successfully authenticated
      setStep("welcome");
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo/primaryblue.svg"
            alt="Beavery logo"
            width={180}
            height={54}
            priority
          />
        </div>

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-black">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-graytext px-4 py-3 text-[16px] text-black font-medium placeholder:text-graytext focus:border-main focus:outline-none focus:ring-2 focus:ring-main/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <Button type="submit" className={isLoading ? "opacity-70" : ""} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        ) : step === "otp" ? (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <p className="mb-2 text-center text-sm text-graytext">
                We sent a 6-digit code to
              </p>
              <p className="mb-6 text-center text-sm font-medium text-black">
                {email}
              </p>
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
            <Button type="submit" className={isLoading ? "opacity-70" : ""} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError(null);
                setOtp(["", "", "", "", "", ""]);
              }}
              disabled={isLoading}
              className="w-full text-center text-sm text-graytext transition-colors hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change email
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-black">Hey, welcome!</h1>
              <p className="text-graytext">You've successfully signed in.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

