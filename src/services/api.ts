/**
 * API Service Layer
 * Handles all HTTP communication with Vercel serverless functions
 * which in turn communicate with GoHighLevel
 */

import axios, { AxiosError } from 'axios';
import type {
  Ticket,
  CreateTicketRequest,
  CreateTicketResponse,
  TicketFilters,
  ApiResponse,
} from '../types/ticket';

// Get API base URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout for API calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging in development
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('[API Error]', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Handle API errors and extract meaningful error messages
 */
function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error || error.message;
    throw new Error(message);
  }
  throw new Error('An unexpected error occurred');
}

/**
 * Create a new ticket
 * @param data - Ticket form data
 * @returns Promise with ticket number and ID
 */
export async function createTicket(
  data: CreateTicketRequest
): Promise<CreateTicketResponse> {
  try {
    const response = await apiClient.post<CreateTicketResponse>(
      '/tickets/create',
      data
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get all tickets with optional filters
 * @param filters - Optional filtering criteria
 * @returns Promise with array of tickets
 */
export async function getTickets(
  filters?: TicketFilters
): Promise<Ticket[]> {
  try {
    const response = await apiClient.get<ApiResponse<Ticket[]>>(
      '/tickets/list',
      {
        params: filters,
      }
    );
    return response.data.data || [];
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Get a single ticket by ID
 * @param id - Ticket ID (GoHighLevel Opportunity ID)
 * @returns Promise with ticket details
 */
export async function getTicket(id: string): Promise<Ticket> {
  try {
    const response = await apiClient.get<ApiResponse<Ticket>>(
      `/tickets/${id}`
    );
    if (!response.data.data) {
      throw new Error('Ticket not found');
    }
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Update an existing ticket
 * @param id - Ticket ID
 * @param data - Partial ticket data to update
 * @returns Promise with updated ticket
 */
export async function updateTicket(
  id: string,
  data: Partial<Ticket>
): Promise<Ticket> {
  try {
    const response = await apiClient.put<ApiResponse<Ticket>>(
      `/tickets/${id}`,
      data
    );
    if (!response.data.data) {
      throw new Error('Failed to update ticket');
    }
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Export tickets to CSV
 * @param filters - Optional filtering criteria
 * @returns Promise with CSV blob
 */
export async function exportTicketsToCSV(
  filters?: TicketFilters
): Promise<Blob> {
  try {
    const response = await apiClient.get('/tickets/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Test connection to GoHighLevel API
 * Useful for verifying configuration
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await apiClient.get<ApiResponse>('/tickets/health');
    return response.data.success;
  } catch (error) {
    return false;
  }
}

// Export the API client for advanced use cases
export { apiClient };
