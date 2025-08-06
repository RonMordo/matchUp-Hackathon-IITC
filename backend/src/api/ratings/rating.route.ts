import { ratingController } from "./rating.controller.js";
import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

router.get("/", ratingController.getAllRating);

router.get("/:id", ratingController.getRatingById);

// Protected
router.use(authMiddleware.authenticate);

router.post("/", ratingController.createRating);

router.put("/:id", ratingController.updateRating);

router.patch("/:id", ratingController.patchRating);

router.delete("/:id", ratingController.deleteRating);

export default router;
