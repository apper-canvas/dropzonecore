import React from "react";
import { motion } from "framer-motion";

const Loading = ({ variant = "default" }) => {
  if (variant === "files") {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface border border-gray-700 rounded-xl p-4 animate-pulse"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-gray-700 rounded"></div>
            </div>
            <div className="mt-3 h-2 bg-gray-700 rounded-full w-full"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "dropzone") {
    return (
      <div className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center animate-pulse">
        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-gray-700 rounded w-48 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-64 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;