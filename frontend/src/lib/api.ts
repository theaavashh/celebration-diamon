/**
 * Get the API base URL from environment variables
 */
const normalizeApiBase = (base: string | undefined): string => {
  if (!base) {
    throw new Error('API base URL is not defined');
  }
  return base.endsWith('/api') ? base : `${base.replace(/\/$/, '')}/api`;
};

export const getApiBaseUrl = (): string => {
  return normalizeApiBase(process.env.NEXT_PUBLIC_API_BASE_URL);
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

  throw new Error('NEXT_PUBLIC_API_URL or NEXT_PUBLIC_API_BASE_URL must be defined in environment variables');
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




