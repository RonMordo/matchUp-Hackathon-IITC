import { Router } from "express";
import { userController } from "./user.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

router.get("/", userController.getAllUsers);

router.get("/:id", userController.getUserById);

// Protected
router.use(authMiddleware.authenticate);

router.put("/", userController.updateUser);

router.patch("/", userController.patchUser);

router.delete("/", userController.deleteUser);

export default router;
