import { MongoClient } from 'mongodb';

const DB_NAME = 'apDB';

// Connect to the db
export function connection(callback) {
  MongoClient.connect(`mongodb://localhost:27017/${DB_NAME}`, (connectionError, client) => {
    console.log(`connected to DB ${DB_NAME}`);
    connection = client.db(DB_NAME);
    callback(connectionError);
  });
};

export const getDB = () => connection;