import uploadsData from "@/services/mockData/uploads.json";
import uploadSessionsData from "@/services/mockData/uploadSessions.json";

let uploads = [...uploadsData];
let uploadSessions = [...uploadSessionsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadService = {
  async getAll() {
    await delay(300);
    return [...uploads];
  },

  async getById(id) {
    await delay(200);
    const upload = uploads.find(u => u.Id === parseInt(id));
    if (!upload) {
      throw new Error(`Upload with ID ${id} not found`);
    }
    return { ...upload };
  },

  async create(uploadData) {
    await delay(400);
    const newId = uploads.length > 0 ? Math.max(...uploads.map(u => u.Id)) + 1 : 1;
    const newUpload = {
      Id: newId,
      status: "uploading",
      progress: 0,
      uploadedAt: new Date().toISOString(),
      url: null,
      ...uploadData
    };
    uploads.push(newUpload);
    return { ...newUpload };
  },

  async update(id, updateData) {
    await delay(250);
    const index = uploads.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Upload with ID ${id} not found`);
    }
    uploads[index] = { ...uploads[index], ...updateData };
    return { ...uploads[index] };
  },

  async delete(id) {
    await delay(200);
    const index = uploads.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Upload with ID ${id} not found`);
    }
    const deleted = uploads.splice(index, 1)[0];
    return { ...deleted };
  },

  async simulateUpload(id, onProgress) {
    const upload = uploads.find(u => u.Id === parseInt(id));
    if (!upload) {
      throw new Error(`Upload with ID ${id} not found`);
    }

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await delay(150);
      upload.progress = progress;
      if (onProgress) {
        onProgress(progress);
      }
    }

    // Mark as completed
    upload.status = "completed";
    upload.url = `/uploads/${upload.name}`;
    upload.uploadedAt = new Date().toISOString();

    return { ...upload };
  },

  async validateFile(file) {
    await delay(100);
    
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

  // Upload session methods
  async createSession(files) {
    await delay(200);
    const newId = uploadSessions.length > 0 ? Math.max(...uploadSessions.map(s => s.Id)) + 1 : 1;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    const newSession = {
      Id: newId,
      files: files.map(f => f.Id),
      totalSize,
      startedAt: new Date().toISOString(),
      completedAt: null
    };

    uploadSessions.push(newSession);
    return { ...newSession };
  },

  async completeSession(id) {
    await delay(150);
    const index = uploadSessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Upload session with ID ${id} not found`);
    }
    
    uploadSessions[index].completedAt = new Date().toISOString();
    return { ...uploadSessions[index] };
  }
};