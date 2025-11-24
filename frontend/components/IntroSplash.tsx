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
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-main transition-opacity duration-500">
      <Image
        src="/logo/primary.png"
        alt="Beavery logo"
        width={200}
        height={60}
        priority
        className="animate-pulse"
      />
    </div>
  );
}

