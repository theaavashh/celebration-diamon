/**
 * Get the API base URL from environment variables
 * Falls back to localhost:5000/api in development if not set
 */
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
  }
  // Client-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
};

/**
 * Get the API URL (without /api suffix) from environment variables
 * Falls back to localhost:5000 in development if not set
 */
export const getApiUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
  }
  // Client-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
};

/**
 * Construct full image URL from relative path
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, prepend API URL
  const apiUrl = getApiUrl();
  return `${apiUrl}${imagePath}`;
};



