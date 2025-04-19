// helpers/getDataFromToken.ts
'use server';
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

interface AuthTokenPayload extends JwtPayload {
  id: string;
}

export async function getDataFromToken(){
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get("token")?.value;
     
    if (!token) {
      throw new Error("No token found in cookies");
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as AuthTokenPayload;

    if (!decoded.id) {
      throw new Error("Invalid token payload");
    }

    return decoded.id;
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Unauthorized");
  }
}
