// Standardized API response contracts matching Spring Boot backend envelope
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
  path?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  rejectedValue?: unknown;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  errors?: ValidationErrorDetail[];
}
