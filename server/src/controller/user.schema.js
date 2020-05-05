import mongoose, { Schema }   from 'mongoose';

const User = new Schema({
  id: {
    type: Schema.Types.ObjectId
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
    type: Schema.Types.String,
    required: true
  },
  password: {
    type: Schema.Types.String,
    required: true
  }
});

module.exports = mongoose.model('User', User, 'users');