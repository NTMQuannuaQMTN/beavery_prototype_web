"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Login from "./components/Login";
import Verify from "./components/Verify";

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
          <Login
            email={email}
            setEmail={setEmail}
            onSubmit={handleEmailSubmit}
            isLoading={isLoading}
            error={error}
          />
        ) : step === "otp" ? (
          <Verify
            email={email}
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleOtpSubmit}
            onBackToEmail={() => {
              setStep("email");
              setError(null);
              setOtp(["", "", "", "", "", ""]);
            }}
            isLoading={isLoading}
            error={error}
          />
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

