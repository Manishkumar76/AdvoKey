import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LawyerProfiles', required: true },
  consultation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultations' },
  chat_session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSessions' },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['successful', 'failed', 'pending'],
    default: 'pending',
  },
  transaction_id: { type: String, unique: true, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Payments || mongoose.model('Payments', paymentSchema);
