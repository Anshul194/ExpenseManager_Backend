/**
 * custom error class for api specific errors
 * helps us pass status codes to the global error handler
 */
class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { ApiError };
