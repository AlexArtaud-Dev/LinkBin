// constants/errorCodes.ts

export enum ErrorCodes {
  // Common Errors
  ValidationError = "VALIDATION_ERROR",
  DatabaseError = "DATABASE_ERROR",
  NotFound = "NOT_FOUND",
  InternalServerError = "INTERNAL_SERVER_ERROR",

  // Specific to URL Shortening
  UrlRequired = "URL_REQUIRED",
  InvalidUrlFormat = "INVALID_URL_FORMAT",
  UrlAlreadyExists = "URL_ALREADY_EXISTS",

  // Specific to Paste Creation
  ContentRequired = "CONTENT_REQUIRED",
  PasteCreationFailed = "PASTE_CREATION_FAILED",
}
