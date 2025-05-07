import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lawyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LawyerProfile',
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
});

export default mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);
