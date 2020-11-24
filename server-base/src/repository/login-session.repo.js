import LoginSessionSchema       from '../model/login-session.model';

/**
 * Get session details by token
 * @param {String} token 
 */
async function getSessionById(token) {
  let loginSessionResponse = await LoginSessionSchema.findOne({_id: token});
  return loginSessionResponse;
}
/**
 * Save login session details
 * @param {LoginSession} sessionDetails 
 */
async function saveSession(sessionDetails) {
  let loginSession = await LoginSessionSchema.create(sessionDetails);
  return loginSession._id;
}

export default {
  create: saveSession,
  getById: getSessionById
};