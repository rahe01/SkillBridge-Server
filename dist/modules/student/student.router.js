import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { StudentController } from "./student.controller";
const router = Router();
router.post("/reviews", authenticate, StudentController.createReview);
export const ReviewRoutes = router;
