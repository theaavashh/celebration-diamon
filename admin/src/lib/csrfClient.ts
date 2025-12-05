// Utility functions for handling CSRF protection

let csrfToken: string | null = null;
let refreshTimer: NodeJS.Timeout | null = null;

/**
 * Fetch CSRF token from the server
 */
export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/csrf-token`, {
      method: 'GET',
      credentials: 'include', // This ensures cookies are sent with the request
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data?.csrfToken) {
        csrfToken = result.data.csrfToken;
        return csrfToken;
      }
    }
    
    console.error('Failed to fetch CSRF token:', response.status);
    return null;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
}

/**
 * Get the current CSRF token
 */
export function getCsrfToken(): string | null {
  return csrfToken;
}

/**
 * Set the CSRF token
 */
export function setCsrfToken(token: string): void {
  csrfToken = token;
}

/**
 * Clear the CSRF token
 */
export function clearCsrfToken(): void {
  csrfToken = null;
  
  // Clear any existing refresh timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

/**
 * Add CSRF token to request headers
 */
export function addCsrfToken(headers: HeadersInit = {}): HeadersInit {
  if (csrfToken) {
    return {
      ...headers,
      'x-csrf-token': csrfToken
    };
  }
  return headers;
}

/**
 * Refresh CSRF token if needed
 */
export async function refreshCsrfTokenIfNeeded(): Promise<void> {
  // In a more complex implementation, you could check token expiration
  // For now, we'll just fetch a new token
  await fetchCsrfToken();
}

/**
 * Start periodic CSRF token refresh
 * This will refresh the token every 10 hours (less than the 12-hour short token expiry)
 */
export function startCsrfTokenRefresh(): void {
  // Clear any existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  
  // Set up periodic refresh (every 10 hours)
  refreshTimer = setInterval(async () => {
    console.log('Refreshing CSRF token...');
    await fetchCsrfToken();
  }, 10 * 60 * 60 * 1000); // 10 hours
}

/**
 * Stop periodic CSRF token refresh
 */
export function stopCsrfTokenRefresh(): void {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}