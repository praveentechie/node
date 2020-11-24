import jwt                      from 'jsonwebtoken';

import LoginSessionRepository   from '../repository/login-session.repo';
import UserController           from '../controller/user.controller';
import { ExpressException }     from '../utils/error-handler';

async function loginUser(userCredentials) {
  let userDetails = await UserController.validateLogin(userCredentials);
  delete userDetails.password;
  let sessionToken = jwt.sign(userDetails.toJSON(), process.env.jwt_sign_secret, {expiresIn: 60});
  let authToken = await LoginSessionRepository.create({sessionToken, userId: userDetails.userName});
  return {userDetails, authToken};
}

async function getSessionDetails(token) {
  if (!token) {
    throw new ExpressException(401, 'Unauthorized', 'Invalid or expired auth token');
  }
  return await LoginSessionRepository.getById(token);
}

async function saveSessionDetails(loginSession) {
  return await LoginSessionRepository.create(loginSession);
}

async function validateToken(authToken) {
  let sessionDetails = await getSessionDetails(authToken);
  return jwt.verify(sessionDetails.sessionToken, process.env.jwt_sign_secret);
}

export default {
  getSessionDetails,
  loginUser,
  saveSessionDetails,
  validateToken
};