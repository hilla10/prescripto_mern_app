import mongoose, { Schema } from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  docId: {
    type: String,
    required: true,
  },
  slotDate: {
    type: String,
    required: true,
  },
  slotTime: {
    type: String,
    required: true,
  },
  userData: {
    type: Schema.Types.Mixed, // Allows any type (Object in this case)
    required: true,
  },
  docData: {
    type: Schema.Types.Mixed,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },

  payment: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model('Appointment', appointmentSchema);

export default Appointment;
