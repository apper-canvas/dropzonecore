import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import DropZone from "@/components/organisms/DropZone";
import FileList from "@/components/organisms/FileList";
import UploadSummary from "@/components/organisms/UploadSummary";
import { uploadService } from "@/services/api/uploadService";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load initial data (uploaded files history)
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      // Note: In a real app, you might want to load recent uploads
      // For this demo, we start with an empty queue
      setFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilesSelected = async (selectedFiles) => {
    const newFiles = [];
    
    for (const file of selectedFiles) {
      try {
        const uploadData = await uploadService.create({
          name: file.name,
          size: file.size,
          type: file.type,
          status: "pending",
          progress: 0
        });
        
        newFiles.push({
          ...uploadData,
          file: file // Keep reference to original file for upload
        });
      } catch (err) {
        toast.error(`Failed to prepare ${file.name}: ${err.message}`);
      }
    }

    if (newFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleStartUpload = async () => {
    const pendingFiles = files.filter(f => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Upload files sequentially for better UX
      for (const file of pendingFiles) {
        try {
          // Update status to uploading
          setFiles(prev => prev.map(f => 
            f.Id === file.Id ? { ...f, status: "uploading", progress: 0 } : f
          ));

          // Simulate upload with progress updates
          await uploadService.simulateUpload(file.Id, (progress) => {
            setFiles(prev => prev.map(f => 
              f.Id === file.Id ? { ...f, progress } : f
            ));
          });

          // Update local state with completed status
          setFiles(prev => prev.map(f => 
            f.Id === file.Id 
              ? { ...f, status: "completed", progress: 100, uploadedAt: new Date().toISOString() }
              : f
          ));

          toast.success(`${file.name} uploaded successfully!`);
        } catch (err) {
          // Update status to error
          setFiles(prev => prev.map(f => 
            f.Id === file.Id ? { ...f, status: "error", progress: 0 } : f
          ));
          
          toast.error(`Failed to upload ${file.name}: ${err.message}`);
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = async (fileId) => {
    try {
      // In a real app, you'd cancel the actual upload request
      setFiles(prev => prev.map(f => 
        f.Id === fileId ? { ...f, status: "pending", progress: 0 } : f
      ));
      
      toast.info("Upload cancelled");
    } catch (err) {
      toast.error(`Failed to cancel upload: ${err.message}`);
    }
  };

  const handleRemoveFile = async (fileId) => {
    try {
      await uploadService.delete(fileId);
      setFiles(prev => prev.filter(f => f.Id !== fileId));
      toast.success("File removed");
    } catch (err) {
      toast.error(`Failed to remove file: ${err.message}`);
    }
  };

  const handleClearAll = () => {
    setFiles([]);
    toast.success("All files cleared");
  };

  const handleRetry = () => {
    loadFiles();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DropZone
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload and manage your files with ease. Drag, drop, and watch the magic happen.
          </p>
        </motion.div>

        {/* Drop Zone */}
        <DropZone onFilesSelected={handleFilesSelected} />

        {/* File List */}
        <FileList
          files={files}
          loading={loading}
          error={error}
          onCancel={handleCancelUpload}
          onRemove={handleRemoveFile}
          onRetry={handleRetry}
        />

        {/* Upload Summary */}
        <UploadSummary
          files={files}
          onStartUpload={handleStartUpload}
          onClearAll={handleClearAll}
          isUploading={isUploading}
        />
      </div>
    </div>
  );
};

export default FileUploader;