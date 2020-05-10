import { get } from 'lodash';
import { ExpressException } from "./error-handler";
/**
 * Validate if user is authorized
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
export const authValidator = (req, res, next) => {
  if (get(req.session, 'passport.user')) {
    next();
  } else {
    throw new ExpressException(401, 'Unauthorized', 'You are not authorized to view this page');
  }

};
/**
 * ### express: error handling
 */
// Higher order function that catches error thrown in target function
export const exceptionHandler = fn => (req, res, next) => {
  fn(req, res).catch(error => next(error));
};