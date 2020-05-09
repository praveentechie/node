import bcrypt             from 'bcrypt';
import UserSchema         from "./user.schema";
import UserCollection     from "../collections/user.collection";
import { ExpressException } from '../utils/error-handler';

const saltRounds = 10

async function createUser (user) {
  if (user.password) {
    user.password = await applySaltAndHash(user.password);
  }
  let userDetails = new UserSchema(user);
  console.log(userDetails);
  return await UserCollection.create(userDetails);
};

async function getUserByUserName(userName, allow404 = true) {
  let userDetails = await UserCollection.getByUserName(userName);
  if (!userDetails && !allow404) {
    throw new ExpressException(400, 'Bad request', 'User doesn\'t exist');
  }
  return userDetails;
}; 

async function getUserById(id) {
  let userDetails = await UserCollection.getById(id);
  if (!userDetails) {
    throw new ExpressException(400, 'Bad request', 'User doesn\'t exist');
  }
  return userDetails;
}; 

async function getAllUsers() {
  return await UserCollection.getAll();
}; 

async function validateLogin(payload) {
  let userDetails = await getUserByUserName(payload.userName);
  let response = await bcrypt.compare(payload.password, userDetails.password);
  return response ? userDetails : false;
}

async function applySaltAndHash(password) {
  let salt = await bcrypt.genSalt(saltRounds);
  console.log('salt ', salt);
  let hashed = await bcrypt.hash(password, salt);
  console.log('hasj ', hashed);
  return hashed;
}

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  getUserByUserName,
  validateLogin
};
