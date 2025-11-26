"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MainBackground from "@/components/MainBackground";
import Toast from "@/components/Toast";
import Button from "@/components/Button";

export default function CreateAccountPage() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update user metadata with name
      const { error: updateError } = await supabase.auth.updateUser({
        data: { name: trimmedName }
      });

      if (updateError) throw updateError;

      // TODO: Update user profile in database if needed
      // Redirect to home page after successful setup
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Failed to set up your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isNameEmpty = !name.trim();

  return (
    <MainBackground className="flex min-h-screen items-center justify-center px-6 py-12">
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

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-black">How should we call you?</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-black">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-graytext px-4 py-3 text-[16px] text-black font-medium placeholder:text-graytext focus:border-main focus:outline-none focus:ring-2 focus:ring-main/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <Button 
              type="submit" 
              className={isLoading || isNameEmpty ? "bg-disabled" : ""} 
              disabled={isLoading || isNameEmpty}
            >
              {isLoading ? "Setting up..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </MainBackground>
  );
}

