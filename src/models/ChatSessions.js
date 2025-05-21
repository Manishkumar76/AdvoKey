import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  consultation_id:{type:mongoose.Schema.Types.ObjectId,ref:'Consultations',required:true},
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LawyerProfiles', required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  ended_at: Date
});

export default mongoose.models.ChatSessions || mongoose.model('ChatSessions', chatSessionSchema);
