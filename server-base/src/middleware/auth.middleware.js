import { get }                from 'lodash';

import AuthController         from '../controller/auth.controller';
import { ExpressException }   from "../utils/error-handler";
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

export const customAuthValidator = (req, res, next) => {
  console.log(req.get('X-Token'), next);
  try {
    AuthController.validateToken(req.get('X-Token')).then(() => {
      next();
    }).catch(() => {
      next(new ExpressException(401, 'Unauthorized', 'You are not authorized to view this page'));
    });
  } catch (exception) {
    next(new ExpressException(401, 'Unauthorized', 'You are not authorized to view this page'));
  }
};
