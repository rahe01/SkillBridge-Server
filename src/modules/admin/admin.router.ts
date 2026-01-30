import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/users", authenticate, AdminController.getAllUsers);

router.patch(
  "/users/:id",
  authenticate,
  AdminController.updateUserStatus
);

export const AdminRoutes = router;
