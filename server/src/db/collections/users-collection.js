const dbConnection = require('../db-connection');
const ObjectID = require('mongodb').ObjectID;

const COLLECTION_NAME = 'users';

function getCollection() {
  return dbConnection.getDB().collection(COLLECTION_NAME);
}
/**
 * Insert one and return id
 * @param {User} user 
 */
function createUser(user) {
  return getCollection().insertOne(user).then(res => {
    return res.insertedId;
  });
}
/**
 * find() returns cursor
 * to get array of results use `toArray()`. If not callback is provided for toArray() Promise will be returned.
 */
function getAllUsers() {
  return getCollection().find({}).toArray().then(res => {
    return res;
  });
  // getCursor.on('data', (data) => {
  //   console.log('data', data);
  //   responseData.push(data);
  // });

  // getCursor.on('end', (data) => {
  //   //On data end
  // });
}
/**
 * Get user details by id. Use ObjectID to convert id to DB ObjectID
 * @param {String} userId 
 */
function getById(userId) {
  return getCollection().findOne({_id: new ObjectID(userId)});
}

module.exports = {
  create: createUser,
  getAll: getAllUsers,
  getById
};
module.exports.userCollectionName = COLLECTION_NAME;