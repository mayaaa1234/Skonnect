type ErrorResponse = {
  msg?: string;
  errs?: Record<string, unknown> | unknown[];
  status?: number;
};

type CustomError = Error & {
  status?: number;
  details?: unknown;
  response?: Response;
};

// Handles errors from fetch responses
// and throws enriched Error objects
export default class ErrorHandler {
  static async handleResponseError(response: Response) {
    let errorData: ErrorResponse = {};

    errorData = await response.json().catch(() => ({}));

    const error = new Error(
      errorData.msg || `HTTP Error ${response.status}: ${response.statusText}`,
    ) as CustomError;

    error.status = response.status;
    error.details = errorData.errs;
    error.response = response;

    throw error;
  }
}
