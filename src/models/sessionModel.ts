import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    _id: String,
    session: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  { collection: 'sessions' }
);

const Session = mongoose.model('Session', sessionSchema);

export default Session;
