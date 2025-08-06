import { messageController } from "./message.controller.js";
import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

router.get("/", messageController.getAllMessages);

router.get("/:id", messageController.getMessageById);

// Protected
router.use(authMiddleware.authenticate);

router.post("/", messageController.createMessage);

router.put("/:id", messageController.updateMessage);

router.patch("/:id", messageController.patchMessage);

router.delete("/:id", messageController.deleteMessage);

export default router;
