// helpers/getDataFromToken.ts
import jwt from "jsonwebtoken";

export async function getDataFromToken(token: string) {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    return decodedToken.id;
  } catch (error: any) {
    throw new Error("Invalid or expired token");
  }
}
