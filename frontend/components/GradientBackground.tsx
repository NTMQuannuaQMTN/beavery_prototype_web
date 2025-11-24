interface GradientBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export default function GradientBackground({
  children,
  className = "",
}: GradientBackgroundProps) {
  return (
    <div
      className={`bg-gradient-to-b from-main to-white ${className}`}
    >
      {children}
    </div>
  );
}

