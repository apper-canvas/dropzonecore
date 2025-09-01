import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-4 py-3 bg-surface border rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
  
  const variants = {
    default: "border-gray-600 focus:border-primary focus:ring-primary/50",
    error: "border-red-500 focus:border-red-500 focus:ring-red-500/50"
  };

  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        baseStyles,
        error ? variants.error : variants.default,
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;