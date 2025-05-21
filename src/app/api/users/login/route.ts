import { connect } from "@/dbConfig/dbConfig";
import Users from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
connect();

export async function POST(request:NextRequest){
try{
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    const user= await Users.findOne({email});

    if(!user){
       return NextResponse.json({error:"Users Not Exist!"},{status:401});
    }

//check password
    const validPassword=await bcryptjs.compare(password,user.password); 
    if(!validPassword){
        return NextResponse.json({error:"Password is not correct"},{status:401});
    }

    //create token data
    const tokenData={
        id:user._id,
        email:user.email,
        role:user.role,
        isAdmin:user.isAdmin,
        user_profile_image_url: user.user_profile_image_url,
    };
    
      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
        expiresIn: '1week' // Token expiration time,
      });
    
      const response = NextResponse.json({
        message: 'Login Success!',
        status: 200,
        success: true,
      });
    
      response.cookies.set('token', token, {
        httpOnly: true 
      });
    
    return response; 
}
catch(err:any){
    console.error("Error in login route:",err);
    return NextResponse.json({error:err.message || "Internal server error"},{status:500});
}}