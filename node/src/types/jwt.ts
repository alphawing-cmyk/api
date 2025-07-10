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

export interface GetTokenType {
  accessToken: string | null | undefined;
  refreshToken: string | null | undefined;
  claims: JwtPayload | null | undefined | string | object;
}
