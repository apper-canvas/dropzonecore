import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({
  title = "No files uploaded yet",
  message = "Start by dragging and dropping files or click to browse.",
  actionLabel = "Browse Files",
  onAction,
  icon = "Upload"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-12"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">{message}</p>
      
      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="lg"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;