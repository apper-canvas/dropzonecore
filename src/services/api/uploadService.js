export const uploadService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "name_c"}}, 
          {"field": {"Name": "size_c"}}, 
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}}, 
          {"field": {"Name": "progress_c"}}, 
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('upload_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch uploads:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching uploads:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "name_c"}}, 
          {"field": {"Name": "size_c"}}, 
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}}, 
          {"field": {"Name": "progress_c"}}, 
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}}
        ]
      };

      const response = await apperClient.getRecordById('upload_c', parseInt(id), params);
      
      if (!response.data) {
        throw new Error(`Upload with ID ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching upload ${id}:`, error?.response?.data?.message || error);
      throw new Error(`Upload with ID ${id} not found`);
    }
  },

  async create(uploadData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          name_c: uploadData.name || uploadData.name_c,
          size_c: uploadData.size || uploadData.size_c,
          type_c: uploadData.type || uploadData.type_c,
          status_c: uploadData.status || uploadData.status_c || "pending",
          progress_c: uploadData.progress || uploadData.progress_c || 0,
          url_c: uploadData.url || uploadData.url_c || null
        }]
      };

      const response = await apperClient.createRecord('upload_c', params);

      if (!response.success) {
        console.error("Failed to create upload:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create upload records:${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to create upload");
        }
        
        return successful[0].data;
      }

      throw new Error("No upload created");
    } catch (error) {
      console.error("Error creating upload:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateRecord = {
        Id: parseInt(id)
      };

      // Map fields to database field names
      if (updateData.status !== undefined) updateRecord.status_c = updateData.status;
      if (updateData.progress !== undefined) updateRecord.progress_c = updateData.progress;
      if (updateData.uploadedAt !== undefined) updateRecord.uploaded_at_c = updateData.uploadedAt;
      if (updateData.url !== undefined) updateRecord.url_c = updateData.url;
      if (updateData.status_c !== undefined) updateRecord.status_c = updateData.status_c;
      if (updateData.progress_c !== undefined) updateRecord.progress_c = updateData.progress_c;
      if (updateData.uploaded_at_c !== undefined) updateRecord.uploaded_at_c = updateData.uploaded_at_c;
      if (updateData.url_c !== undefined) updateRecord.url_c = updateData.url_c;

      const params = {
        records: [updateRecord]
      };

      const response = await apperClient.updateRecord('upload_c', params);

      if (!response.success) {
        console.error("Failed to update upload:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update upload records:${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to update upload");
        }
        
        return successful[0].data;
      }

      throw new Error("No upload updated");
    } catch (error) {
      console.error("Error updating upload:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('upload_c', params);

      if (!response.success) {
        console.error("Failed to delete upload:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete upload records:${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to delete upload");
        }
        
        return true;
      }

      throw new Error("No upload deleted");
    } catch (error) {
      console.error("Error deleting upload:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async simulateUpload(id, onProgress) {
    // Simulate upload progress with database updates
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 150));
      
      try {
        await this.update(id, { 
          status_c: progress === 100 ? "completed" : "uploading",
          progress_c: progress,
          uploaded_at_c: progress === 100 ? new Date().toISOString() : undefined,
          url_c: progress === 100 ? `/uploads/file-${id}` : undefined
        });
      } catch (error) {
        console.error("Error updating upload progress:", error);
      }

      if (onProgress) {
        onProgress(progress);
      }
    }

    return await this.getById(id);
  },

  async validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png", 
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/csv",
      "application/json"
    ];

    if (file.size > maxSize) {
      throw new Error(`File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type "${file.type}" is not allowed. Supported types: images, PDF, Word documents, text files.`);
    }

    return true;
  },

  async createSession(files) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const totalSize = files.reduce((sum, file) => sum + (file.size_c || file.size), 0);
      const fileIds = files.map(f => f.Id).join(',');

      const params = {
        records: [{
          files_c: fileIds,
          total_size_c: totalSize,
          started_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('upload_session_c', params);

      if (!response.success) {
        console.error("Failed to create upload session:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create upload session records:${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to create upload session");
        }
        
        return successful[0].data;
      }

      throw new Error("No upload session created");
    } catch (error) {
      console.error("Error creating upload session:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async completeSession(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          completed_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('upload_session_c', params);

      if (!response.success) {
        console.error("Failed to complete upload session:", response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to complete upload session records:${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || "Failed to complete upload session");
        }
        
        return successful[0].data;
      }

      throw new Error("No upload session updated");
    } catch (error) {
      console.error("Error completing upload session:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getHistory() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "name_c"}}, 
          {"field": {"Name": "size_c"}}, 
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}}, 
          {"field": {"Name": "progress_c"}}, 
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}}
        ],
        where: [
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": ["completed"]}
        ],
        orderBy: [{"fieldName": "uploaded_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('upload_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch upload history:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching upload history:", error?.response?.data?.message || error);
      return [];
    }
  }
};