import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  lawyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LawyerProfiles',
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

export default mongoose.models.Consultations || mongoose.model('Consultations', ConsultationSchema);
