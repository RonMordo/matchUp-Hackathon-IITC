import { CreateUserInput, IUser } from "../users/user.types.js";

export interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export type LoginInput = Pick<IUser, "email" | "password">;

export type RegisterInput = CreateUserInput;
