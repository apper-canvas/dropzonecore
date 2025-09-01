import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadProgress from "@/components/molecules/UploadProgress";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const FileList = ({ 
  files = [], 
  loading = false, 
  error = null, 
  onCancel, 
  onRemove, 
  onRetry,
  title = "Upload Queue"
}) => {
  if (loading) {
    return <Loading variant="files" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load files"
        message={error}
        onRetry={onRetry}
        variant="inline"
      />
    );
  }

  if (!files || files.length === 0) {
    return (
      <Empty
        title="No files in queue"
        message="Files you select will appear here ready for upload."
        icon="FileText"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <span className="text-sm text-gray-400">
          {files.length} file{files.length !== 1 ? "s" : ""}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {files.map((file, index) => (
          <motion.div
            key={file.Id || index}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
              layout: { duration: 0.3 },
              opacity: { duration: 0.2 },
              y: { duration: 0.3 }
            }}
          >
            <UploadProgress
              file={file}
              onCancel={onCancel}
              onRemove={onRemove}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileList;