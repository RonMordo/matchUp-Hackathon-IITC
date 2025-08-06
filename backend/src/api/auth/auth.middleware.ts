import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import { AuthenticatedRequest } from "../../utils/globalTypes.js";
import { AppError } from "../../utils/appError.js";

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (typeof token !== "string") {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const decoded = authService.verifyToken(token);
    (req as AuthenticatedRequest).user = decoded;
    return next();
  } catch (err) {
    return next(err);
  }
};

export const authMiddleware = { authenticate };
