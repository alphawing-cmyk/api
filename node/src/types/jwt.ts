import { JwtPayload } from "jsonwebtoken";

export interface VerifyResult {
  valid: boolean;
  claims: JwtPayload | string | null;
}

export interface RemixClaims {
  valid: boolean;
  claims:
    | {}
    | {
        role: string;
        username: string;
        accessToken: string;
        refreshToken: string;
        email: string;
      };
}