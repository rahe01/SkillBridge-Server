import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
const router = Router();
// GET current user
router.get("/me", authenticate, userController.getUser);
// PATCH update current user
router.patch("/me", authenticate, userController.updateUser);
export const userRoutes = router;
