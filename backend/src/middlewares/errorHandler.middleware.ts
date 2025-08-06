import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    console.log("Error:", err.message);
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      errors: err.errors ?? [],
    });
  } else if (err instanceof Error) {
    console.log(err.message);
    return res.status(500).json({
      status: "Server error",
      stackTrace: err.stack,
      message: err.message,
    });
  }

  console.error("Unhandled Error:", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong. Please try again later.",
  });
};
