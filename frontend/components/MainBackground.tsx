interface MainBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainBackground({
  children,
  className = "",
}: MainBackgroundProps) {
  return (
    <div className={`bg-white ${className}`}>
      {children}
    </div>
  );
}

