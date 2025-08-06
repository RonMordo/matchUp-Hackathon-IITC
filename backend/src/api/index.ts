import { Router } from "express";
import userRouter from "./users/user.route.js";
import authRouter from "./auth/auth.route.js";
import eventRouter from "./events/event.route.js";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/events", eventRouter);

export default router;
