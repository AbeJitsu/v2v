import mongoose from 'mongoose';

interface IVisitCounter extends mongoose.Document {
  value: number;
}

const VisitCounterSchema = new mongoose.Schema({
  value: { type: Number, default: 0 },
});

export const VisitCounter = mongoose.model<IVisitCounter>(
  'VisitCounter',
  VisitCounterSchema
);
