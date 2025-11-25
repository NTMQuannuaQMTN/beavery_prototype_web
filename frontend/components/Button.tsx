interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseClasses = [
    // Layout & sizing
    "w-full rounded-full px-4 py-3",
    // Typography
    "text-[16px] font-extrabold text-white",
    // Colors & background
    "bg-main",
    // Transitions
    "transition-all duration-200",
    // Interactions
    "hover:bg-main/80 active:scale-95 cursor-pointer",
    // Disabled states
    "disabled:bg-disabled disabled:cursor-not-allowed disabled:hover:bg-disabled disabled:text-graytext disabled:active:scale-100",
    // Custom classes
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}

