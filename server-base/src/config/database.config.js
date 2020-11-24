import mongoose from 'mongoose';

// Connect to the db
async function connect() {
  const DB_NAME = process.env.mongo_db_name,
    HOST = process.env.mongo_host,
    PORT = process.env.mongo_port;
  try {
    await mongoose.connect(
      `mongodb://${HOST}:${PORT}/${DB_NAME}`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    );
    return mongoose;
  } catch(error) {
    throw new Error(error);
  }
};

export default connect;
