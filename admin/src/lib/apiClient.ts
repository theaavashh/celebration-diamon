// Utility functions for making authenticated API calls using cookies
import { addCsrfToken, fetchCsrfToken, refreshCsrfTokenIfNeeded, getCsrfToken } from './csrfClient';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Make an authenticated GET request
 */
export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Request failed',
        message: result.message || 'Request failed'
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      message: 'Network error'
    };
  }
}

/**
 * Make an authenticated POST request
 */
export async function apiPost<T>(url: string, data?: any): Promise<ApiResponse<T>> {
  try {
    // Ensure we have a CSRF token
    await fetchCsrfToken();
    
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...addCsrfToken()
      },
      body: JSON.stringify(data)
    });

    // If we get a CSRF error, try refreshing the token
    if (response.status === 403) {
      // Clone the response to avoid consuming the original body stream
      const clonedResponse = response.clone();
      const result = await clonedResponse.json();
      if (result.message && result.message.includes('CSRF')) {
        await refreshCsrfTokenIfNeeded();
        // Retry the request with the new token
        const retryResponse = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...addCsrfToken()
          },
          body: JSON.stringify(data)
        });
        return await handleResponse(retryResponse);
      }
    }

    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      message: 'Network error'
    };
  }
}

/**
 * Make an authenticated POST request with FormData
 */
export async function apiPostFormData<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
  try {
    // Ensure we have a CSRF token
    await fetchCsrfToken();
    
    // Debugging: Log the CSRF token
    console.log('CSRF Token:', getCsrfToken());
    
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...addCsrfToken()
        // Don't set Content-Type header for FormData - let the browser set it with the correct boundary
      },
      body: formData
    });

    // Debugging: Log the response
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    // If we get a CSRF error, try refreshing the token
    if (response.status === 403) {
      // Clone the response to avoid consuming the original body stream
      const clonedResponse = response.clone();
      const result = await clonedResponse.json();
      console.log('CSRF Error response:', result);
      if (result.message && result.message.includes('CSRF')) {
        await refreshCsrfTokenIfNeeded();
        // Retry the request with the new token
        const retryResponse = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            ...addCsrfToken()
            // Don't set Content-Type header for FormData - let the browser set it with the correct boundary
          },
          body: formData
        });
        return await handleResponse(retryResponse);
      }
    }

    return await handleResponse(response);
  } catch (error) {
    console.error('Error in apiPostFormData:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      message: 'Network error'
    };
  }
}

/**
 * Make an authenticated PUT request
 */
export async function apiPut<T>(url: string, data?: any): Promise<ApiResponse<T>> {
  try {
    // Ensure we have a CSRF token
    await fetchCsrfToken();
    
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...addCsrfToken()
      },
      body: JSON.stringify(data)
    });

    // If we get a CSRF error, try refreshing the token
    if (response.status === 403) {
      // Clone the response to avoid consuming the original body stream
      const clonedResponse = response.clone();
      const result = await clonedResponse.json();
      if (result.message && result.message.includes('CSRF')) {
        await refreshCsrfTokenIfNeeded();
        // Retry the request with the new token
        const retryResponse = await fetch(url, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...addCsrfToken()
          },
          body: JSON.stringify(data)
        });
        return await handleResponse(retryResponse);
      }
    }

    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      message: 'Network error'
    };
  }
}

/**
 * Make an authenticated PUT request with FormData
 */
export async function apiPutFormData<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
  try {
    // Ensure we have a CSRF token
    await fetchCsrfToken();
    
    // Debugging: Log the CSRF token
    console.log('CSRF Token:', getCsrfToken());
    
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        ...addCsrfToken()
        // Don't set Content-Type header for FormData - let the browser set it with the correct boundary
      },
      body: formData
    });

    // Debugging: Log the response
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    // If we get a CSRF error, try refreshing the token
    if (response.status === 403) {
      // Clone the response to avoid consuming the original body stream
      const clonedResponse = response.clone();
      const result = await clonedResponse.json();
      console.log('CSRF Error response:', result);
      if (result.message && result.message.includes('CSRF')) {
        await refreshCsrfTokenIfNeeded();
        // Retry the request with the new token
        const retryResponse = await fetch(url, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            ...addCsrfToken()
            // Don't set Content-Type header for FormData - let the browser set it with the correct boundary
          },
          body: formData
        });
        return await handleResponse(retryResponse);
      }
    }

    return await handleResponse(response);
  } catch (error) {
    console.error('Error in apiPutFormData:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      message: 'Network error'
    };
  }
}

/**
 * Make an authenticated DELETE request
 */
export async function apiDelete<T>(url: string): Promise<ApiResponse<T>> {
  try {
    // Ensure we have a CSRF token
    await fetchCsrfToken();
    
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...addCsrfToken()
      }
    });

    // Handle case where DELETE returns no content (204)
    if (response.status === 204) {
      return {
        success: true,
        message: 'Deleted successfully'
      };
    }

    // If we get a CSRF error, try refreshing the token
    if (response.status === 403) {
      // Clone the response to avoid consuming the original body stream
      const clonedResponse = response.clone();
      const result = await clonedResponse.json();
      if (result.message && result.message.includes('CSRF')) {
        await refreshCsrfTokenIfNeeded();
        // Retry the request with the new token
        const retryResponse = await fetch(url, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...addCsrfToken()
          }
        });
        
        // Handle case where DELETE returns no content (204) after retry
        if (retryResponse.status === 204) {
          return {
            success: true,
            message: 'Deleted successfully'
          };
        }
        
        return await handleResponse(retryResponse);
      }
    }

    return await handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      message: 'Network error'
    };
  }
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const result = await response.json();
  
  if (!response.ok) {
    return {
      success: false,
      error: result.message || 'Request failed',
      message: result.message || 'Request failed'
    };
  }

  return {
    success: true,
    data: result.data,
    message: result.message
  };
}

/**
 * Handle authentication errors and redirect to login if needed
 */
export function handleAuthError(message: string | undefined): boolean {
  if (message === 'Access denied. No token provided.' || 
      message?.includes('Session expired') || 
      message?.includes('Invalid token') ||
      message?.includes('Unauthorized')) {
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return true;
  }
  return false;
}