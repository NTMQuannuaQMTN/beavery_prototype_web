interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-full px-4 py-3 text-[16px] font-extrabold text-white transition-all duration-200 bg-main hover:bg-main/80 active:scale-95 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

