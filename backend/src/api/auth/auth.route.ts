import { Router } from "express";
import { authMiddleware } from "./auth.middleware.js";
import { authController } from "./auth.controller.js";

const router = Router();

router.post("/login", authController.login);
router.post("/logout", authMiddleware.authenticate, authController.logout);
router.post("/register", authController.register);
router.get("/me", authMiddleware.authenticate, authController.me);
router.post("/otp-send", authController.sendOtp);
router.post("/otp-verify", authController.verifyOtp);

export default router;
