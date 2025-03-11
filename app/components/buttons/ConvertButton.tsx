import React from "react";

interface ConvertButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  children: React.ReactNode;
}

const ConvertButton: React.FC<ConvertButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  fullWidth = true,
  type = "button",
  className = "",
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        bg-white/60 text-black font-medium py-3 rounded-lg
        hover:bg-white/70 disabled:bg-white/20 disabled:text-white/40 
        transition-all duration-200 cursor-pointer
        ${fullWidth ? "w-full" : "px-8"}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
          <span>Converting...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default ConvertButton;
