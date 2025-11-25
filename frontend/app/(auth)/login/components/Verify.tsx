"use client";

import Button from "@/components/Button";

interface VerifyProps {
  email: string;
  otp: string[];
  setOtp: (otp: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToEmail: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function Verify({
  email,
  otp,
  setOtp,
  onSubmit,
  onBackToEmail,
  isLoading,
  error,
}: VerifyProps) {
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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
        onClick={onBackToEmail}
        disabled={isLoading}
        className="w-full text-center text-sm text-graytext transition-colors hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Change email
      </button>
    </form>
  );
}

