import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JwtPayload, LoginInput, RegisterInput } from "./auth.types.js";
import { AppError } from "../../utils/appError.js";
import { userService } from "../users/user.service.js";
import bcrypt from "bcrypt";
import twilioClient from "../../services/twilio.js";
import crypto from "crypto";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const hashPassword = (password: string) => {
  const salt = 10;
  const hashedPassword = bcrypt.hash(password, salt);
  return hashedPassword;
};

const generateToken = (payload: JwtPayload) => {
  if (!JWT_SECRET) {
    throw new AppError("Error loading JWT_SECRET.", 500);
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token: string) => {
  if (!JWT_SECRET) {
    throw new AppError("Error loading JWT_SECRET.", 500);
  }
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

const register = async (userData: RegisterInput) => {
  const newUser = await userService.createUser(userData);
  return newUser;
};

const login = async (userData: LoginInput) => {
  const user = await userService.getUserByEmail(userData.email);
  const isMatch = await bcrypt.compare(userData.password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials.", 400);
  }
  const payload = { id: user._id.toString(), email: user.email };
  const token = generateToken(payload);
  return token;
};

const sendOtp = (phone: string) => {
  if (!phone) {
    throw new AppError("Invalid phone number", 400);
  }
  return twilioClient.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    .verifications.create({ to: phone, channel: "sms" });
};

const verifyOtp = async (phone: string, code: string) => {
  if (!phone || !code) throw new AppError("Invalid phone number or code", 400);

  return twilioClient.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    .verificationChecks.create({ to: phone, code });
};

const hashPhone = (phoneNumber: string): string => {
  return crypto.createHash("sha256").update(phoneNumber).digest("hex");
};

export const authService = {
  register,
  login,
  verifyToken,
  hashPassword,
  generateToken,
  sendOtp,
  verifyOtp,
  hashPhone,
};
