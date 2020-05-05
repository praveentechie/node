import mongoose from 'mongoose';

const DB_NAME = 'apDB',
  HOST = 'localhost';
// Connect to the db
async function connect() {
  try {
    await mongoose.connect(
      `mongodb://${HOST}:27017/${DB_NAME}`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    );
  } catch(error) {
    throw new Error(error);
  }
};

export default connect;
