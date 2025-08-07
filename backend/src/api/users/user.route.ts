import { Router } from "express";
import { userController } from "./user.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

router.get("/", userController.getAllUsers);

router.get(
  "/messages",
  authMiddleware.authenticate,
  userController.getAllMessages
);

router.get(
  "/events",
  authMiddleware.authenticate,
  userController.getAllEventsProtected
);

router.get(
  "/notifications",
  authMiddleware.authenticate,
  userController.getAllNotifications
);

router.get("/:id", userController.getUserById);

router.get("/:id/events", userController.getAllEvents);

// Protected
router.use(authMiddleware.authenticate);

router.post("/messages", userController.sendMessage);

router.put("/", userController.updateUser);

router.patch("/notifications/:id", userController.toggleReadNotification);

router.patch("/", userController.patchUser);

router.delete("/", userController.deleteUser);

export default router;
