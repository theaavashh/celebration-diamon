/**
 * Get the API base URL from environment variables
 * Falls back to localhost:5000/api in development if not set
 */
export const getApiBaseUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
  return base.endsWith('/api') ? base : `${base.replace(/\/$/, '')}/api`;
};

/**
 * Get the API URL (without /api suffix) from environment variables
 * Falls back to localhost:5000 in development if not set
 */
export const getApiUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }

  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/?$/, '');
  }

  return 'http://localhost:5000';
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

  // Normalize absolute filesystem paths returned by the API
  const uploadsIndex = imagePath.indexOf('/uploads/');
  let normalizedPath = uploadsIndex !== -1 ? imagePath.slice(uploadsIndex) : imagePath;

  normalizedPath = normalizedPath.replace(/\\/g, '/');
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }
  
  // Otherwise, prepend API URL
  const apiUrl = getApiUrl();
  return `${apiUrl}${normalizedPath}`;
};




