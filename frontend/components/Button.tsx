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
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full px-4 py-3 text-[16px] font-extrabold text-white transition-all duration-200 bg-main hover:bg-main/80 active:scale-95 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed hover:bg-main active:scale-100" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

