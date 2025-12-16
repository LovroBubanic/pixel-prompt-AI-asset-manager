// API Configuration
// Update this with your deployed API Gateway URL after deployment
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  GET_UPLOAD_URL: `${API_BASE_URL}/get-upload-url`,
  GET_IMAGES: `${API_BASE_URL}/get-images`,
};

// User ID management - generates unique ID per browser using localStorage
const USER_ID_STORAGE_KEY = 'pixelprompt_userId';

/**
 * Gets or generates a unique user ID for this browser session.
 * The ID is stored in localStorage and persists across page refreshes.
 * If localStorage is not available, generates a temporary ID.
 */
export const getUserId = (): string => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return 'default-user';
  }

  try {
    // Try to get existing user ID from localStorage
    let userId = localStorage.getItem(USER_ID_STORAGE_KEY);
    
    if (!userId) {
      // Generate a new unique user ID
      // Format: user-{timestamp}-{random}
      userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem(USER_ID_STORAGE_KEY, userId);
    }
    
    return userId;
  } catch (error) {
    // If localStorage is not available (e.g., private browsing), use session-based ID
    console.warn('localStorage not available, using session-based ID');
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
};

// For backward compatibility (deprecated - use getUserId() instead)
export const DEFAULT_USER_ID = getUserId();

