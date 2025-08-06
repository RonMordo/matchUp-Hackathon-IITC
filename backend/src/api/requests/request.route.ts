import { Router } from "express";
import { requestController } from "./request.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

router.get("/", requestController.getAllRequests);

router.get("/:id", requestController.getRequestById);

// Protected
router.use(authMiddleware.authenticate);

router.put("/:id", requestController.updateRequest);

router.patch("/:id", requestController.patchRequest);

router.delete("/:id", requestController.deleteRequest);

export default router;
