import { UserInfo } from "../types/auth.ts";
import jwt, { JwtPayload } from "jsonwebtoken";


export const generateJwtKeys = (user: UserInfo) => {
  try {
    const { sign } = jwt;
    const accessToken = sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET ?? "",
      {
        expiresIn:
          parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || "10") * 60,
      }
    );

    const refreshToken = sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET ?? "",
      {
        expiresIn:
          parseInt(process.env.REFRESH_TOKEN_EXPIRE_MINUTES || "10080") * 60,
      }
    );

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error(err as string);
  }
};