import mongoose, { Schema }   from 'mongoose';

const User = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  profileId: {
    type: Schema.Types.String
  },
  provider: {
    type: Schema.Types.String
  },
  userName: {
    type: Schema.Types.String,
    required: true,
    unique: true
  },
  firstName: {
    type: Schema.Types.String,
    required: true
  },
  lastName: {
    type: Schema.Types.String
  },
  password: {
    type: Schema.Types.String,
    required: true
  },
  profilePic: {
    type: Schema.Types.Buffer
  }
});

module.exports = mongoose.model('User', User, 'users');