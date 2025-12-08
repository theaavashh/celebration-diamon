/**
 * Get the API base URL from environment variables
 */
const normalizeApiBase = (base: string | undefined): string => {
  const resolved = base && base.trim().length > 0 ? base : 'http://localhost:5000/api';
  return resolved.endsWith('/api') ? resolved : `${resolved.replace(/\/$/, '')}/api`;
};

export const getApiBaseUrl = (): string => {
  const fromBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fromUrl = process.env.NEXT_PUBLIC_API_URL;
  return normalizeApiBase(fromBase || fromUrl);
};

/**
 * Get the API URL (without /api suffix) from environment variables
 */
export const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    return apiUrl.replace(/\/$/, '');
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (base) {
    return normalizeApiBase(base).replace(/\/api$/, '');
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

  // Ensure leading slash and replace backslashes
  normalizedPath = normalizedPath.replace(/\\/g, '/');
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }
  
  // Otherwise, prepend API URL
  const apiUrl = getApiUrl();
  return `${apiUrl}${normalizedPath}`;
};




