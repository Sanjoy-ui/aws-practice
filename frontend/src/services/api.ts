import { Item, ItemCreate, ItemUpdate, PaginatedItems, HealthStatus } from '../types/item';

// When empty or unset, relative paths are used (Same-Origin architecture).
// Vite proxies /api, /health in local development; CloudFront proxies them in AWS production.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.detail || errorJson.message || errorMessage;
      } catch {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
      throw new ApiError(errorMessage, response.status);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Failed to connect to backend at ${url}. Ensure the FastAPI server is running.`,
      0
    );
  }
}

export const api = {
  // System Health
  checkHealth: async (): Promise<HealthStatus> => {
    return request<HealthStatus>('/health');
  },

  // CRUD Operations for Items
  getItems: async (params?: {
    skip?: number;
    limit?: number;
    search?: string;
    completed?: boolean;
  }): Promise<PaginatedItems> => {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
    if (params?.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.completed !== undefined) searchParams.append('completed', params.completed.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/items/${queryString ? `?${queryString}` : ''}`;
    return request<PaginatedItems>(endpoint);
  },

  getItem: async (id: number): Promise<Item> => {
    return request<Item>(`/api/items/${id}`);
  },

  createItem: async (data: ItemCreate): Promise<Item> => {
    return request<Item>('/api/items/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateItem: async (id: number, data: ItemUpdate): Promise<Item> => {
    return request<Item>(`/api/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteItem: async (id: number): Promise<{ message: string; id: number }> => {
    return request<{ message: string; id: number }>(`/api/items/${id}`, {
      method: 'DELETE',
    });
  },
};
