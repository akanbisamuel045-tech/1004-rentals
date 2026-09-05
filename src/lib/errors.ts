/**
 * Standard API error response shape.
 * All API routes return this structure for errors.
 */
export interface ApiError {
  error: string;
  details?: unknown;
  code?: string;
}

/**
 * Standard API success response shape.
 */
export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

/**
 * Creates a standardized error response object.
 */
export function createErrorResponse(
  message: string,
  details?: unknown,
  code?: string
): ApiError {
  return { error: message, ...(details ? { details } : {}), ...(code ? { code } : {}) };
}

/**
 * HTTP status codes used in the application.
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Application-level error class with HTTP status support.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    public readonly code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Handles unknown errors safely, returning a sanitized message.
 * Prevents leaking internal details to clients.
 */
export function handleUnknownError(error: unknown): { message: string; statusCode: number } {
  if (error instanceof AppError) {
    return { message: error.message, statusCode: error.statusCode };
  }

  if (error instanceof Error) {
    // In production, don't expose raw error messages
    if (process.env.NODE_ENV === "production") {
      return {
        message: "An unexpected error occurred. Please try again.",
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
    return { message: error.message, statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR };
  }

  return {
    message: "An unexpected error occurred.",
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  };
}
