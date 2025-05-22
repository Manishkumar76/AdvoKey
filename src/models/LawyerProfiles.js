import mongoose from 'mongoose';

const lawyerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true },
  bio: String,
  years_of_experience: Number,
  hourly_rate: Number,
  availability:{type:Array},
  specialization_id:{type:mongoose.Schema.Types.ObjectId,ref:'Specializations',unique:true},
  level: { type: String, enum: ['junior', 'mid-level', 'senior'] },
  profile_status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  proof_documents: [String], // array of file URLs or paths
  isVerified:Boolean
}, { timestamps: { createdAt: 'created_at' } });

export default mongoose.models.LawyerProfiles || mongoose.model('LawyerProfiles', lawyerProfileSchema);
