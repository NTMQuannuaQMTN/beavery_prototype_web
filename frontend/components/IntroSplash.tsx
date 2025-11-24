"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface IntroSplashProps {
  duration?: number;
  onComplete?: () => void;
}

export default function IntroSplash({
  duration = 1500,
  onComplete,
}: IntroSplashProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Start exit animation slightly before hiding
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 600); // Start exit 600ms before completion

    const hideTimer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onComplete]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-700 ease-in-out ${
        isExiting
          ? "bg-white opacity-0 scale-110"
          : "bg-main opacity-100 scale-100"
      }`}
    >
      <div
        className={`transition-all duration-700 ease-in-out ${
          isExiting
            ? "opacity-0 scale-50 -translate-y-20"
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        <Image
          src="/logo/primary.png"
          alt="Beavery logo"
          width={200}
          height={60}
          priority
          className={isExiting ? "" : "animate-pulse"}
        />
      </div>
    </div>
  );
}

