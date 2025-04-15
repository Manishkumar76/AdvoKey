import mongoose from 'mongoose';

const specializationSchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

export default mongoose.models.Specialization || mongoose.model('Specialization', specializationSchema);
