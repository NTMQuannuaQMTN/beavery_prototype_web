"use client";

import Button from "@/components/Button";
import Link from "next/link";

interface LoginProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

export default function Login({
  email,
  setEmail,
  onSubmit,
  isLoading,
  error,
}: LoginProps) {
  const isEmailEmpty = !email.trim();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
      <Button 
        type="submit" 
        className={isLoading || isEmailEmpty ? "opacity-70" : ""} 
        disabled={isLoading || isEmailEmpty}
      >
        {isLoading ? "Sending..." : "Continue with email"}
      </Button>
      <p className="text-[13px] text-graytext text-center font-medium">
        By continuing, you are agreeing to Beavery Space's{" "}
        <Link href="/terms" className="font-medium text-darkgraytext hover:underline">
          Terms of Service
        </Link>
        {" "}and{" "}
        <Link href="/privacy" className="font-medium text-darkgraytext hover:underline">
          Privacy Policy
        </Link>
        {" "}and giving us consent to send you emails.
      </p>
    </form>
  );
}

