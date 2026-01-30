import { Router } from "express";
import { TutorController } from "./tutor.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/profile", authenticate, TutorController.upsertProfile);
router.post("/availability", authenticate, TutorController.setAvailability);
router.get("/", TutorController.getTutors);
router.get("/:id", TutorController.getTutor);

export const TutorRoutes = router;
