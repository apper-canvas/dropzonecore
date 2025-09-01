import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const ProgressBar = forwardRef(({ 
  className,
  value = 0,
  max = 100,
  variant = "primary",
  size = "md",
  showLabel = true,
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const baseStyles = "relative w-full rounded-full overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary",
    secondary: "bg-gradient-to-r from-secondary to-primary",
    success: "bg-gradient-to-r from-success to-green-600",
    warning: "bg-gradient-to-r from-warning to-yellow-600",
    error: "bg-gradient-to-r from-error to-red-600"
  };
  
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const backgroundSizes = {
    sm: "h-2",
    md: "h-3", 
    lg: "h-4"
  };

  return (
    <div
      ref={ref}
      className={cn(baseStyles, className)}
      {...props}
    >
      <div className={cn("bg-gray-700 w-full rounded-full", backgroundSizes[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "rounded-full transition-all duration-300 relative overflow-hidden",
            variants[variant],
            sizes[size]
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
        </motion.div>
      </div>
      
      {showLabel && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-300 bg-background px-2 py-1 rounded ml-2"
        >
          {Math.round(percentage)}%
        </motion.div>
      )}
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;