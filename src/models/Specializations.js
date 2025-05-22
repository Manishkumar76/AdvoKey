import mongoose from 'mongoose';

const specializationSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  lawyers:{
    type:Array
  }
});

export default mongoose.models.Specializations || mongoose.model('Specializations', specializationSchema);
