import { FastifySchemaValidationError } from "fastify/types/schema.ts";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RoleEnum } from "../types/enums.js";
import { createCipheriv, randomBytes, createDecipheriv } from "crypto";
import { FastifyRequest } from "fastify";
import prisma from "./prisma.ts";







const verifyJwtToken = (token: string): VerifyResult => {
  try {
    const result = jwt.verify(token, process.env.JWT_SECRET as string);
    return { valid: true, claims: result as JwtPayload | string };
  } catch (err) {
    console.log(err);
    return { valid: false, claims: null };
  }
};



const verifyJwtTokenFromRemixCookie = (
  token: string | undefined,
  secret: string
): RemixClaims => {
  if (!token) {
    return { valid: true, claims: {} };
  }

  try {
    let result = Buffer.from(token, "base64url").toString("utf-8");
    result = JSON.parse(result);
    return { valid: true, claims: result };
  } catch (err) {
    console.log(err);
    return { valid: false, claims: {} };
  }
};

const isJwtPayload = (obj: any): obj is JwtPayload => {
  return (
    obj &&
    typeof obj === "object" &&
    "claims" in obj &&
    typeof obj.claims === "object" &&
    "id" in obj.claims &&
    typeof obj.claims.id === "number"
  );
};

const encrypt = (text: string) => {
  const iv = randomBytes(16);
  const key = Buffer.from(process.env.AES_256_SECRET as string, "hex");
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

const decrypt = (encryptedText: string): string => {
  const textParts = encryptedText.split(":");
  const shiftedPart = textParts.shift();

  if (shiftedPart === undefined) {
    throw new Error("Invalid encrypted text format");
  }

  const iv = Buffer.from(shiftedPart, "hex");
  const encryptedData = Buffer.from(textParts.join(":"), "hex");
  const key = Buffer.from(process.env.AES_256_SECRET as string, "hex");

  const decipher = createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

interface GetTokenType {
  accessToken: string | null | undefined;
  refreshToken: string | null | undefined;
  claims: JwtPayload | null | undefined | string | object;
}

const getToken = (request: FastifyRequest): GetTokenType => {
  let accessToken;
  let refreshToken;

  // Check remix cookie
  if (request.cookies?.remix) {
    let claims = verifyJwtTokenFromRemixCookie(request.cookies?.remix, "123");
    let user = "user" in claims.claims ? claims.claims.user : null;

    if (user !== null && typeof user === "object" && "accessToken" in user) {
      accessToken = user.accessToken as string;
    }

    if (user !== null && typeof user === "object" && "refreshToken" in user) {
      refreshToken = user.refreshToken as string;
    }
    return { accessToken, refreshToken, claims: claims.claims };
  }

  // Check for other cookie
  if (request.cookies?.refreshToken || request.cookies?.accessToken) {
    let claims = verifyJwtToken(request.cookies?.accessToken as string);
    return {
      accessToken: request.cookies?.accessToken,
      refreshToken: request.cookies?.refreshToken,
      claims: claims.claims,
    };
  }

  // Check Authorization header
  const authHeader = request.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return {
      accessToken: authHeader.slice(7),
      refreshToken: null,
      claims: null,
    };
  }

  return { accessToken: null, refreshToken: null, claims: null };
};

const findUser = async (request: FastifyRequest | undefined, id?: number) => {
  if (id) {
    const user = await prisma.user.findFirst({ where: { id: id } });
    return user;
  } else if (request) {
    const tokenData = getToken(request);

    if (tokenData.claims === null) {
      return undefined;
    }

    if (typeof tokenData.claims === "object" && "id" in tokenData.claims) {
      const user = await prisma.user.findFirst({ where: { id: tokenData.claims.id } });
      return user;
    }

    if (typeof tokenData.claims === "object" && "user" in tokenData.claims) {
      const user = await prisma.user.findFirst({
        where: { username: tokenData.claims.user.username },
      });
      return user;
    }
  }

  return undefined;
};

export {
  createErrorMessage,
  generateJwtKeys,
  verifyJwtToken,
  verifyJwtTokenFromRemixCookie,
  isJwtPayload,
  encrypt,
  decrypt,
  getToken,
  findUser,
};
