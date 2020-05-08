import UserSchema         from "../controller/user.schema";

/**
 * Insert one and return id
 * @param {User} user 
 */
async function createUser(user) {
  let response = await UserSchema.create(user)
  console.log('res', response);
  return response;
}
/**
 * Get all users
 */
async function getAllUsers() {
  return await UserSchema.find({});
}
/**
 * Get user details by id.
 * @param {String} userId 
 */
async function getUserById(userId) {
  return await UserSchema.findOne({_id: userId});
}
/**
 * Get user details by id.
 * @param {String} userName 
 */
async function getUserByUserName(userName) {
  return await UserSchema.findOne({userName});
}

module.exports = {
  create: createUser,
  getAll: getAllUsers,
  getById: getUserById,
  getByUserName: getUserByUserName
};
