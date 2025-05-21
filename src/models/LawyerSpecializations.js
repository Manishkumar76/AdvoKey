import mongoose from 'mongoose';

const lawyerSpecializationSchema = new mongoose.Schema({
  lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LawyerProfiles' },
  specialization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Specializations' },
});

lawyerSpecializationSchema.index({ lawyer_id: 1, specialization_id: 1 }, { unique: true });

export default mongoose.models.LawyerSpecializations || mongoose.model('LawyerSpecializations', lawyerSpecializationSchema);
