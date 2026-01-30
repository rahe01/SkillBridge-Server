import { Router } from "express";
import { ReviewController } from "./student.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/reviews", authenticate, ReviewController.createReview);

export const ReviewRoutes = router;
