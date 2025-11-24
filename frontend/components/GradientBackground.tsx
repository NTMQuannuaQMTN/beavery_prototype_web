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
      className={`bg-gradient-to-b from-blue-300 to-white ${className}`}
    >
      {children}
    </div>
  );
}

