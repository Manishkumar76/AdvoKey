import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LawyerProfile', required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  ended_at: Date
});

export default mongoose.models.ChatSession || mongoose.model('ChatSession', chatSessionSchema);
