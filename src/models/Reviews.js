import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // consultation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultations' },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LawyerProfiles' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
}, { timestamps: { createdAt: 'created_at' } });

export default mongoose.models.Reviews || mongoose.model('Reviews', reviewSchema);
