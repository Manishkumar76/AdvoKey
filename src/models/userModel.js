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
password:{
    type:String,
    required:[true],
    
},
isAdmin:{
    type:Boolean,
    default:false
},
role:['user'],
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