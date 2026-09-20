export interface FieldError {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly fieldErrors?: FieldError[];

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', fieldErrors?: FieldError[]) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.fieldErrors = fieldErrors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', id?: string) {
    const msg = id ? `${resource} with ID '${id}' was not found.` : `${resource} was not found.`;
    super(msg, 404, `${resource.toUpperCase().replace(/\s+/g, '_')}_NOT_FOUND`);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required to access this resource.') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to access this resource.') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Request validation failed.', fieldErrors?: FieldError[]) {
    super(message, 400, 'VALIDATION_FAILED', fieldErrors);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict or duplicate detected.') {
    super(message, 409, 'CONFLICT');
  }
}
