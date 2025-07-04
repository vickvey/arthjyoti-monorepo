export class ApiError extends Error {
  statusCode?: number;

  constructor(statusCode: number, message: string, stack?: string | null) {
    super(message);

    // Required to restore the correct prototype chain (important when targeting ES5/ES6)
    Object.setPrototypeOf(this, ApiError.prototype);

    this.statusCode = statusCode;
    this.name = "ApiError";

    if (stack) {
      this.stack = stack;
    } else if (Error.captureStackTrace) {
      // Capture the stack trace if one isn't provided
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
