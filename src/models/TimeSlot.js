import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  lawyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LawyerProfiles' },
  start_time: Date,
  end_time: Date,
  is_booked: { type: Boolean, default: false }
});

export default mongoose.models.TimeSlot || mongoose.model('TimeSlot', timeSlotSchema);
