import { connect } from "@/dbConfig/dbConfig";
import Users from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {

        // Parse the request body
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        console.log(reqBody);

        // Check if the user already exists
        const user = await Users.findOne({ email });
       
        if (user) {
            return NextResponse.json(
                { message: "Users already exists" },
                 {status: 400 }
            );
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user
        const newUser = new Users({
            username,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        console.log(savedUser._id);

        //send verification email
         await sendmail({email, emailType:"VERIFY",userId:savedUser._id});
        // Return success response
        return NextResponse.json({
            message: "Users created successfully",
            success: true,
            user: savedUser,
        });
    } catch (err: any) {
        console.error("Error in signup route:", err);
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}