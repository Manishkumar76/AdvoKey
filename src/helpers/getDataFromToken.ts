
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function getDataFromToken(request: NextRequest) {

    try {
        const token = request.cookies.get('token')?.value || "";

        const decodedtoken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

        const userId = decodedtoken.id;

        return userId;
    } catch (error: any) {
        throw new Error(error.message);
    }
}


