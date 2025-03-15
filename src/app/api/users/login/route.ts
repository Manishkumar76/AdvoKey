import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
connect();

export async function POST(request:NextRequest){
try{
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    const user= await User.findOne({email});

    if(!user){
       return NextResponse.json({error:"User Not Exist!"},{status:401});
    }

//check password
    const validPassword=await bcryptjs.compare(password,user.password); 
    if(!validPassword){
        return NextResponse.json({error:"Password is not correct"},{status:401});
    }

    //create token data
    const tokenData={
        id:user._id,
        email:user.email
    };

    //create token
   const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{
    expiresIn:'1d'})

    const response= NextResponse.json({
        message:"Login Success!",
        status:200,
        success:true  
    })
   
    response.cookies.set("token",token,{
        httpOnly:true,
    })
    return response; 
}
catch(err:any){
    console.error("Error in login route:",err);
    return NextResponse.json({error:err.message || "Internal server error"},{status:500});
}}