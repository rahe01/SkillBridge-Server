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

router.get("/categories", authenticate, AdminController.getCategories);
router.post("/categories", authenticate, AdminController.createCategory);
router.put("/categories/:id", authenticate, AdminController.updateCategory);
router.delete("/categories/:id", authenticate, AdminController.deleteCategory);

export const AdminRoutes = router;
