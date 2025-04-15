import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LawyerProfile' },
  timeslot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: String,
}, { timestamps: { createdAt: 'created_at' } });

export default mongoose.models.Consultation || mongoose.model('Consultation', consultationSchema);
