import { eventController } from "./event.controller.js";
import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

router.get("/", eventController.getAllEvents);

router.get("/:id", eventController.getEventById);

// Protected
router.use(authMiddleware.authenticate);

router.post("/", eventController.createEvent);

router.put("/:id", eventController.updateEvent);

router.patch("/:id", eventController.patchEvent);

router.delete("/:id", eventController.deleteEvent);

export default router;
