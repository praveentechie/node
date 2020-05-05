import bcrypt             from 'bcrypt';
import UserSchema         from "./user.schema";
import UserCollection     from "../collections/user.collection";

const saltRounds = 10

async function createUser (user) {
  try {
    user.password = await applySaltAndHash(user.password);
    let userDetails = new UserSchema(user);
    console.log(userDetails);
    return await UserCollection.create(userDetails);
  } catch (error) {
    console.log('err', error);
    throw new Error(error);
  }
};

async function validateLogin(payload) {
  try {
    let userDetails = await getUserByUserName(payload.userName);
    return await bcrypt.compare(payload.password, userDetails.password);
  } catch (error) {
    console.log('error', error);
    throw new Error(error);
  }
}

async function getUserByUserName(userName) {
  return await UserCollection.getByUserName(userName);
}; 

async function getUserById(id) {
  return await UserCollection.getById(id);
}; 

async function getAllUsers() {
  return await UserCollection.getAll();
}; 

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
