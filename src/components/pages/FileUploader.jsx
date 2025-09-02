import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import DropZone from "@/components/organisms/DropZone";
import FileList from "@/components/organisms/FileList";
import UploadSummary from "@/components/organisms/UploadSummary";
import HistoryPanel from "@/components/organisms/HistoryPanel";
import { uploadService } from "@/services/api/uploadService";
const FileUploader = () => {
const [files, setFiles] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load initial data (uploaded files history)
useEffect(() => {
    loadFiles();
    loadHistory();
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

  const loadHistory = async () => {
    try {
      const historyData = await uploadService.getHistory();
      setHistory(historyData);
    } catch (err) {
      console.error('Failed to load upload history:', err.message);
    }
  };

  const handleFilesSelected = async (selectedFiles) => {
    const newFiles = [];
    
    for (const file of selectedFiles) {
      try {
const uploadData = await uploadService.create({
          name_c: file.name,
          size_c: file.size,
          type_c: file.type,
          status_c: "pending",
          progress_c: 0
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
const pendingFiles = files.filter(f => f.status_c === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Upload files sequentially for better UX
      for (const file of pendingFiles) {
        try {
          // Update status to uploading
setFiles(prev => prev.map(f => 
            f.Id === file.Id ? { ...f, status_c: "uploading", progress_c: 0 } : f
          ));

          // Simulate upload with progress updates
          await uploadService.simulateUpload(file.Id, (progress) => {
setFiles(prev => prev.map(f => 
              f.Id === file.Id ? { ...f, progress_c: progress } : f
            ));
          });

          // Update local state with completed status
setFiles(prev => prev.map(f => 
            f.Id === file.Id 
              ? { ...f, status_c: "completed", progress_c: 100, uploaded_at_c: new Date().toISOString() }
              : f
          ));

toast.success(`${file.name_c} uploaded successfully!`);
        } catch (err) {
          // Update status to error
setFiles(prev => prev.map(f => 
            f.Id === file.Id ? { ...f, status_c: "error", progress_c: 0 } : f
          ));
          
toast.error(`Failed to upload ${file.name_c}: ${err.message}`);
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
        f.Id === fileId ? { ...f, status_c: "pending", progress_c: 0 } : f
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

  const handleReUpload = async (historyFile) => {
    try {
      // Create a new upload entry based on the history item
const newUpload = await uploadService.create({
        name_c: historyFile.name_c,
        size_c: historyFile.size_c,
        type_c: historyFile.type_c,
        status_c: "pending",
        progress_c: 0
      });
      
setFiles(prevFiles => [...prevFiles, newUpload]);
      toast.success(`${historyFile.name_c} added to upload queue`);
} catch (err) {
      toast.error(`Failed to re-upload ${historyFile.name_c}: ${err.message}`);
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

        {/* History Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="flex bg-surface border border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setShowHistory(false)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                !showHistory
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upload Queue
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                showHistory
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upload History
            </button>
          </div>
        </motion.div>

        {/* File List / History Panel */}
        {!showHistory ? (
          <FileList
            files={files}
            loading={loading}
            error={error}
            onCancel={handleCancelUpload}
            onRemove={handleRemoveFile}
            onRetry={handleRetry}
            title="Upload Queue"
          />
        ) : (
          <HistoryPanel
            history={history}
            loading={loading}
            onReUpload={handleReUpload}
          />
        )}

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