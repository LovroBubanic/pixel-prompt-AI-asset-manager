import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, getUserId } from '../config';
import type { ImageItem } from '../types';

interface UseImageGalleryReturn {
  images: ImageItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const POLL_INTERVAL = 3000; // Poll every 3 seconds

export const useImageGallery = (pollingEnabled: boolean = true): UseImageGalleryReturn => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get(API_ENDPOINTS.GET_IMAGES, {
        params: {
          userId: getUserId(),
          limit: 50,
        },
      });
      setImages(response.data.images || []);
      setIsLoading(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch images';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchImages();

    // Set up polling if enabled
    if (pollingEnabled) {
      const interval = setInterval(() => {
        fetchImages();
      }, POLL_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [fetchImages, pollingEnabled]);

  return {
    images,
    isLoading,
    error,
    refresh: fetchImages,
  };
};

