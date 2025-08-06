import { Router } from "express";
import userRouter from "./users/user.route.js";
import authRouter from "./auth/auth.route.js";
import eventRouter from "./events/event.route.js";
import requestRouter from "./requests/request.route.js";
import hobbyRouter from "./hobbies/hobby.route.js";
import messageRouter from "./messages/message.route.js";
import notificationRouter from "./notifications/notification.route.js";
import ratingRouter from "./ratings/rating.route.js";

const router = Router();

router.use("/users", userRouter);
router.use("/requests", requestRouter);
router.use("/auth", authRouter);
router.use("/events", eventRouter);
router.use("/hobbies", hobbyRouter);
router.use("/messages", messageRouter);
router.use("/notifications", notificationRouter);
router.use("/ratings", ratingRouter);

export default router;
