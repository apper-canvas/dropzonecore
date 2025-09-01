import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md",
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-200";
  
  const variants = {
    default: "bg-gray-700 text-gray-300",
    primary: "bg-primary/20 text-primary border border-primary/30",
    secondary: "bg-secondary/20 text-secondary border border-secondary/30",
    success: "bg-success/20 text-success border border-success/30",
    warning: "bg-warning/20 text-warning border border-warning/30",
    error: "bg-error/20 text-error border border-error/30",
    info: "bg-info/20 text-info border border-info/30"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs rounded-md",
    md: "px-2.5 py-1.5 text-sm rounded-lg",
    lg: "px-3 py-2 text-base rounded-lg"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;