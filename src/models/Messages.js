// models/Messages.ts
import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSessions', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  content:{type:String},
  timestamp: { type: Date, default: Date.now },
 
})

export default mongoose.models.Messages || mongoose.model('Messages', messageSchema)
