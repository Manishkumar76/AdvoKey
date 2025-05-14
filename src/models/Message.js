// models/Message.ts
import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  content:{type:String},
  timestamp: { type: Date, default: Date.now },
 
})

export default mongoose.models.Message || mongoose.model('Message', messageSchema)
