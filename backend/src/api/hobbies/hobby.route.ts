import { hobbyController } from "./hobby.controller.js";
import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

router.get("/", hobbyController.getAllHobbys);

router.get("/:id", hobbyController.getHobbyById);

// Protected
router.use(authMiddleware.authenticate);

router.post("/", hobbyController.createHobby);

router.put("/:id", hobbyController.updateHobby);

router.patch("/:id", hobbyController.patchHobby);

router.delete("/:id", hobbyController.deleteHobby);

export default router;
