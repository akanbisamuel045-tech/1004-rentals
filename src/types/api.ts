/**
 * API response type definitions.
 * Used throughout the application for consistent API contracts.
 */

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  error: string;
  details?: unknown;
  code?: string;
}

export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; details?: unknown };
