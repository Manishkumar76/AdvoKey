import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
username:{
    type:String,
    required:[true, "Please provide a username"],
    unique:true,
     },
email:{
    type:String,
    required:[true,"Please provide a email"],
    unique:true
    },
phone: { type: String },
profile_image_url: { type: String },
location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
password:{
    type:String,
    required:[true],
    
},
isAdmin:{
    type:Boolean,
    default:false
},
role:{
    type:String, enum:['Client','Lawyer','Admin'],default:'Client'},
isverify:{
    type:Boolean,
    default:false
},
forgotPasswordToken:String,
forgotPasswordExpiry:Date,
verifyToken: String,
verifyTokenExpiry:Date


});

const User= mongoose.models.User || mongoose.model('User',userSchema); 

export default User; 