import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, getUserId } from '../config';

interface UploadResponse {
  uploadUrl: string;
  s3Key: string;
  expiresIn: number;
}

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<{ success: boolean; s3Key?: string; error?: string }>;
  isUploading: boolean;
  uploadProgress: number;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File): Promise<{ success: boolean; s3Key?: string; error?: string }> => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG and PNG images are allowed.' };
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return { success: false, error: `File size exceeds maximum of ${maxSize / 1024 / 1024}MB` };
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Get presigned URL
      const response = await axios.post<UploadResponse>(API_ENDPOINTS.GET_UPLOAD_URL, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        userId: getUserId(),
      });

      const { uploadUrl, s3Key } = response.data;

      // Step 2: Upload directly to S3 using presigned URL
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      setIsUploading(false);
      setUploadProgress(0);
      return { success: true, s3Key };
    } catch (error: any) {
      setIsUploading(false);
      setUploadProgress(0);
      const errorMessage = error.response?.data?.error || error.message || 'Upload failed';
      return { success: false, error: errorMessage };
    }
  };

  return {
    uploadImage,
    isUploading,
    uploadProgress,
  };
};

