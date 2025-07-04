import { RoleEnum } from "./enums.ts";

export interface LoginBody {
  username: string;
  password: string;
}

export interface RegisterBody {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  password: string;
  confirmPassword?: string;
  isActive?: boolean | undefined;
  role: RoleEnum;
  imgPath?: string;
  refreshToken?: string;
}

export interface ForgotPasswordBody {
  email: string;
  origin: string;
}

export interface ResetPasswordBody {
  password: string;
  token: string;
}

export interface UpdateUserBody {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  password?: string;
}

export interface UserInfo {
  id: number;
  role: RoleEnum;
}