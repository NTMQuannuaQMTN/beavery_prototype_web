"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MainBackground from "@/components/MainBackground";
import Toast from "@/components/Toast";
import Login from "./components/Login";
import Verify from "./components/Verify";
import Info from "./components/Info";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "info" | "welcome">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // User has a session, check if they have a name
          const { data: { user } } = await supabase.auth.getUser();

          if (user?.email) {
            const { data: userData } = await supabase
              .from("users")
              .select("email, name")
              .eq("email", user.email)
              .maybeSingle();

            console.log(userData);

            if (userData && userData.name && userData.name.trim()) {
              // User is authenticated and has a name, redirect to home
              router.replace("/home");
            } else {
              // User is authenticated but no name, redirect to create page
              // But they need OTP verification flag, so redirect to landing instead
              router.replace("/");
            }
          }
        }
      } catch (err) {
        // If check fails, continue with login flow
        console.error("Auth check error:", err);
      }
    };

    checkExistingAuth();
  }, [router]);

  useEffect(() => {
    if (error) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [error]);

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

  const handleResendOtp = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      // Silently handle any errors - don't show toast for resend OTP
      if (error) {
        // Just log the error without showing toast
        console.error("Resend OTP error:", error);
      }
    } catch (err: any) {
      // Silently handle errors - don't show toast for resend OTP
      console.error("Resend OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };


  const classifyOtpError = (error: any): string => {
    if (!error) return "Invalid OTP. Please try again.";

    // Get error message from various possible locations
    const errorMessage = (
      error.message ||
      error.error?.message ||
      error.toString()
    )?.toLowerCase() || "";

    const errorCode = (
      error.code ||
      error.error?.code
    )?.toLowerCase() || "";

    // Check for wrong OTP errors (covers expired, invalid, or wrong code)
    if (
      errorMessage.includes("invalid token") ||
      errorMessage.includes("invalid otp") ||
      errorMessage.includes("token mismatch") ||
      errorMessage.includes("token has expired") ||
      errorMessage.includes("expired or invalid") ||
      errorMessage.includes("has expired") ||
      errorMessage.includes("or invalid") ||
      errorMessage.includes("invalid") ||
      errorMessage.includes("expired") ||
      errorCode === "token_expired" ||
      errorCode === "invalid_token" ||
      errorCode === "expired_token"
    ) {
      return "Oops, wrong code. Please try again!";
    }

    // Return original error message or default fallback
    return error.message || error.error?.message || "Invalid OTP. Please try again.";
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

      // Mark that OTP verification was just completed (for create page access)
      sessionStorage.setItem("otp_verified", "true");
      sessionStorage.setItem("otp_verified_timestamp", Date.now().toString());

      // Successfully authenticated - check if user exists in database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email, name")
        .eq("email", email)
        .maybeSingle();

      // Check if user exists and has a name
      if (userData && userData.name && userData.name.trim()) {
        // User already has a name, go straight to home
        sessionStorage.removeItem("otp_verified");
        sessionStorage.removeItem("otp_verified_timestamp");
        router.push("/home");
      } else {
        // User doesn't exist or doesn't have a name, go to info step
        setStep("info");
      }
    } catch (err: any) {
      // If it's a database error (user not found), go to info step
      if (err.code === "PGRST116") {
        // No rows returned - user doesn't exist
        setStep("info");
      } else if (err.message?.includes("Invalid token") || err.message?.includes("expired")) {
        // OTP verification error
        setError(classifyOtpError(err));
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
      } else {
        // Other errors - show error message
        setError(err.message || "An error occurred. Please try again.");
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your name");
      setIsLoading(false);
      return;
    }

    try {
      // Get the access token for API authentication
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Session expired. Please sign in again.");
      }

      const token = session.access_token;

      // Call backend API to create user
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const axios = require('axios');
      const response = await axios.post(
        `${backendUrl}/auth/create-user`,
        { name: trimmedName },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      // Clear OTP verification flag
      sessionStorage.removeItem("otp_verified");
      sessionStorage.removeItem("otp_verified_timestamp");

      // Redirect to home page after successful setup
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Failed to set up your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainBackground className="min-h-screen">
      {error && (
        <Toast
          key={error}
          message={error}
          isVisible={showToast}
          onClose={() => {
            setShowToast(false);
            setError(null);
          }}
          duration={2000}
        />
      )}
      <div className="flex min-h-screen">
        {/* Left side - Interactive content */}
        <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 lg:px-12 lg:py-16">
          <div className="w-full max-w-md space-y-8">
            {/* Logo and Header */}
            <div className="space-y-4">
              <div className="flex justify-start">
                <Image
                  src="/logo/primaryblue.svg"
                  alt="Beavery logo"
                  width={160}
                  height={48}
                  priority
                  className="transition-opacity duration-300"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-black dark:text-white transition-all duration-300">
                  {step === "email" ? "Welcome back" : step === "otp" ? "Verify your email" : step === "info" ? "How should we call you?" : "Hey, welcome!"}
                </h1>
                <div className="transition-all duration-300">
                  {step === "email" ? (
                    <p className="text-black text-[18px] font-bold">
                      Enter your email to get started
                    </p>
                  ) : step === "otp" ? (
                    <div className="space-y-1">
                      <div className="pb-4">
                        <button
                          type="button"
                          onClick={() => {
                            setStep("email");
                            setError(null);
                            setShowToast(false);
                            setOtp(["", "", "", "", "", ""]);
                          }}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1.5 text-sm text-black font-medium transition-all duration-100 cursor-pointer hover:font-bold disabled:cursor-not-allowed disabled:hover:text-graytext"
                        >
                          <ion-icon name="arrow-back" style={{ fontSize: "14px", display: "block" }}></ion-icon>
                          Change email
                        </button>
                      </div>
                      <p className="text-black text-[18px] font-bold">
                        We've sent a 6-digit code to your email!
                      </p>
                      <p className="text-graytext text-[16px] font-medium">
                        {email}
                      </p>
                    </div>
                  ) : step === "info" ? (
                    <p className="text-black text-[18px] font-bold">
                      How should we call you?
                    </p>
                  ) : (
                    <p className="text-black text-[18px] font-bold">
                      You've successfully signed in.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step === "email" || step === "otp" || step === "info" ? "bg-main" : "bg-gray-200 dark:bg-gray-700"
                }`} />
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step === "otp" || step === "info" ? "bg-main" : "bg-gray-200 dark:bg-gray-700"
                }`} />
              <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step === "info" ? "bg-main" : "bg-gray-200 dark:bg-gray-700"
                }`} />
            </div>

            {/* Form Content with Animation */}
            <div className="relative min-h-[300px]">
              <div
                key={step}
                className="animate-fade-in"
              >
                {step === "email" ? (
                  <Login
                    email={email}
                    setEmail={setEmail}
                    onSubmit={handleEmailSubmit}
                    isLoading={isLoading}
                    error={null}
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
                      setShowToast(false);
                      setOtp(["", "", "", "", "", ""]);
                    }}
                    onResendOtp={handleResendOtp}
                    isLoading={isLoading}
                  />
                ) : step === "info" ? (
                  <Info
                    name={name}
                    setName={setName}
                    onSubmit={handleInfoSubmit}
                    isLoading={isLoading}
                    error={error}
                  />
                ) : (
                  <div className="text-center space-y-6">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold text-black dark:text-white">Hey, welcome!</h1>
                      <p className="text-graytext">You've successfully signed in.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Bold vibrant design */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden rounded-2xl m-4">
          {/* Vibrant gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-main/20 via-main/10 to-main/5 dark:from-main/30 dark:via-main/20 dark:to-main/10" />

          {/* Decorative floating elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Code-like symbols floating */}
            <div className="absolute top-20 left-10 text-main/20 dark:text-main/30 text-4xl font-mono animate-pulse" style={{ animationDelay: "0s" }}>
              {"</>"}
            </div>
            <div className="absolute top-40 right-16 text-main/20 dark:text-main/30 text-3xl font-mono animate-pulse" style={{ animationDelay: "0.5s" }}>
              {"{}"}
            </div>
            <div className="absolute bottom-32 left-20 text-main/20 dark:text-main/30 text-5xl font-mono animate-pulse" style={{ animationDelay: "1s" }}>
              {"()"}
            </div>
            <div className="absolute top-60 right-24 text-main/20 dark:text-main/30 text-2xl font-mono animate-pulse" style={{ animationDelay: "1.5s" }}>
              {"[]"}
            </div>
            <div className="absolute bottom-20 right-12 text-main/20 dark:text-main/30 text-4xl font-mono animate-pulse" style={{ animationDelay: "2s" }}>
              {"=>"}
            </div>
          </div>

          {/* Decorative blur circles */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-main rounded-full blur-3xl opacity-20 dark:opacity-30" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-main rounded-full blur-3xl opacity-20 dark:opacity-30" />
          </div>

          {/* Content area */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
            <div className="w-full max-w-md mx-auto rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-700/30 shadow-2xl p-12 text-center space-y-6">
              <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-main/10 to-main/5 dark:from-main/20 dark:to-main/10 border-2 border-main/20 dark:border-main/30 flex items-center justify-center">
                <svg className="w-16 h-16 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-graytext dark:text-gray-300 font-medium">Content area</p>
            </div>
          </div>
        </div>
      </div>
    </MainBackground>
  );
}

