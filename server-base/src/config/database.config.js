import mongoose from 'mongoose';

// Connect to the db
async function connect() {
  const DB_NAME = process.env.mongo_db_name,
    HOSTNAME = process.env.mongo_hostname,
    USE_AUTH = process.env.use_auth === 'true',
    USER = process.env.mongo_user,
    PASSWORD = process.env.mongo_password;

  //mongodb+srv://dbMaster:<password>@clusterap.zov3d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
  let mongoUri = `mongodb://${HOSTNAME}/${DB_NAME}`;
  if (USE_AUTH) {
    mongoUri = `mongodb+srv://${USER}:${PASSWORD}@${HOSTNAME}/${DB_NAME}`
  }

  console.log(DB_NAME, HOSTNAME, typeof USE_AUTH, USER, PASSWORD, mongoUri);

  try {
    await mongoose.connect(
      mongoUri,
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
