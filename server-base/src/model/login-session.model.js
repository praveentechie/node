import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 }     from 'uuid';

let LoginSession = new Schema({
  _id: {
    type: Schema.Types.String,
    default: uuidv4
  },
  userId: {
    type: Schema.Types.String,
    required: true
  },
  sessionToken: {
    type: Schema.Types.String,
    required: true
  },
  createTime: {
    type: Schema.Types.Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('LoginSession', LoginSession, 'loginSession');