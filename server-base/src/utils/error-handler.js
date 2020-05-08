/**
 * ### express: error handling
 */
export class ExpressException extends Error {
  constructor(statusCode, status, message) {
    super();
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
  }
}

export const handleError = (err, res) => {
  let errorResponse = {
    status: err.status || 'Internal server error',
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal server error'
  };
  if (process.env.NODE_ENV === 'development' && ![400, 401].includes(errorResponse.statusCode)) {
    errorResponse.stackTrace = err.stack;
  }
  res.status(errorResponse.statusCode).send(errorResponse);
};