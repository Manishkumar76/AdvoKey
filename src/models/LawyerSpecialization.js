import mongoose from 'mongoose';

const lawyerSpecializationSchema = new mongoose.Schema({
  lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LawyerProfile' },
  specialization_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialization' },
});

lawyerSpecializationSchema.index({ lawyer_id: 1, specialization_id: 1 }, { unique: true });

export default mongoose.models.LawyerSpecialization || mongoose.model('LawyerSpecialization', lawyerSpecializationSchema);
