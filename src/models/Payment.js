// src/models/Payment.ts
import mongoose, { Schema, Document } from 'mongoose';



const paymentSchema = new Schema({
  client_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lawyer_id: { type: Schema.Types.ObjectId, ref: 'LawyerProfile', required: true },
  consultation_id: { type: Schema.Types.ObjectId, ref: 'Consultation' },
  chat_session_id: { type: Schema.Types.ObjectId, ref: 'ChatSession' },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['successful', 'failed', 'pending'], default: 'pending' },
  transaction_id: { type: String, unique: true, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);
