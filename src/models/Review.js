import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // consultation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LawyerProfile' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
}, { timestamps: { createdAt: 'created_at' } });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
