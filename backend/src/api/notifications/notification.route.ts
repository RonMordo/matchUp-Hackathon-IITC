import { notificationController } from "./notification.controller.js";
import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

// Protected
router.use(authMiddleware.authenticate);

router.get("/", notificationController.getAllNotifications);

router.get("/:id", notificationController.getNotificationById);

router.post("/", notificationController.createNotification);

router.put("/:id", notificationController.updateNotification);

router.patch("/:id", notificationController.patchNotification);

router.delete("/:id", notificationController.deleteNotification);

export default router;
