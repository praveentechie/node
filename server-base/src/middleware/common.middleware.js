/**
 * ### express: error handling
 */
// Higher order function that catches error thrown in target function
export const exceptionHandler = fn => (req, res, next) => {
  fn(req, res).catch(error => next(error));
};