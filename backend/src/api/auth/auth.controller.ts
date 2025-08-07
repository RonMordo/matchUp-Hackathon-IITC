import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import { LoginInput, RegisterInput } from "./auth.types.js";
import { ResponseUser } from "../users/user.types.js";
import { AuthenticatedRequest } from "../../utils/globalTypes.js";
import { userService } from "../users/user.service.js";

const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response<ResponseUser>,
  next: NextFunction
) => {
  try {
    const { password, ...newUser } = (
      await authService.register(req.body)
    ).toObject();
    return res.status(201).json(newUser);
  } catch (err) {
    return next(err);
  }
};

const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await authService.login(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

const logout = async (_req: AuthenticatedRequest, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  return res.status(200).json({ success: true });
};

const me = async (
  req: AuthenticatedRequest,
  res: Response<ResponseUser>,
  next: NextFunction
) => {
  try {
    const { password, ...user } = (
      await userService.getUserById(req.user!.id)
    ).toObject();
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

const sendOtp = async (
  req: Request<{}, {}, { phone: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.sendOtp(req.body.phone);
    return res.status(200).json({ message: "OTP send successfully" });
  } catch (err) {
    return next(err);
  }
};

const verifyOtp = async (
  req: Request<{}, {}, { phone: string; code: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, code } = req.body;
    const varificationCheck = await authService.verifyOtp(phone, code);
    if (varificationCheck.status === "approved") {
      const phoneHash = authService.hashPhone(phone);
      const token = authService.generateToken({ id: phoneHash, email: phone });
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      });
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    return next(err);
  }
};

export const authController = {
  login,
  register,
  logout,
  me,
  sendOtp,
  verifyOtp,
};
