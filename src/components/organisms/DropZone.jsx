import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { uploadService } from "@/services/api/uploadService";
import { cn } from "@/utils/cn";

const DropZone = ({ onFilesSelected, className, ...props }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const processFiles = async (fileList) => {
    const files = Array.from(fileList);
    const validFiles = [];
    const invalidFiles = [];

    for (const file of files) {
      try {
        await uploadService.validateFile(file);
        validFiles.push(file);
      } catch (error) {
        invalidFiles.push({ file, error: error.message });
        toast.error(`${file.name}: ${error.message}`, {
          position: "top-right",
          autoClose: 5000
        });
      }
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
      toast.success(`${validFiles.length} file(s) ready for upload`, {
        position: "top-right",
        autoClose: 3000
      });
    }

    if (invalidFiles.length > 0) {
      console.warn("Invalid files:", invalidFiles);
    }
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFiles(files);
    }
  }, [onFilesSelected]);

  const handleFileInput = useCallback(async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFiles(files);
    }
    // Reset input value to allow same file selection
    e.target.value = "";
  }, [onFilesSelected]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(className)}
      {...props}
    >
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300",
          isDragActive 
            ? "border-primary bg-gradient-to-br from-primary/20 to-secondary/20 scale-[1.02] shadow-2xl shadow-primary/25"
            : isDragOver
            ? "border-primary/70 bg-primary/10"
            : "border-gray-600 hover:border-gray-500 hover:bg-gray-800/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
        />

        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div
              key="drag-active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
                <ApperIcon name="Upload" className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Drop files here!
              </h3>
              <p className="text-gray-300 text-lg">
                Release to upload your files
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto">
                <ApperIcon name="Upload" className="w-8 h-8 text-gray-300" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">
                  Drag and drop files here
                </h3>
                <p className="text-gray-400 max-w-sm mx-auto">
                  or click to browse and select files from your computer
                </p>
              </div>

              <Button variant="secondary" size="lg">
                <ApperIcon name="FolderOpen" className="w-5 h-5 mr-2" />
                Browse Files
              </Button>

              <div className="space-y-2 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-500">Supported formats:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["JPG", "PNG", "GIF", "PDF", "DOC", "TXT", "CSV"].map((format) => (
                    <span
                      key={format}
                      className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-md"
                    >
                      {format}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-600">Maximum file size: 10MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated background effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              background: isDragActive 
                ? "radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)"
                : "transparent"
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DropZone;