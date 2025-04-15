import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chat_session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message_text: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
