import { Router } from "express";
import { BookingController } from "./booking.controller";
import { authenticate } from "../../middlewares/auth.middleware";
const router = Router();
router.post("/", authenticate, BookingController.createBooking);
router.get("/", authenticate, BookingController.getBookings);
router.get("/:id", authenticate, BookingController.getBookingById);
router.patch("/:id/status", authenticate, BookingController.updateBookingStatus);
export const BookingRoutes = router;
