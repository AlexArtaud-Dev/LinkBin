export interface ApiError {
  code: string; // A unique error code
  message: string; // A user-friendly error message
  details?: string; // Optional technical details for debugging
}
