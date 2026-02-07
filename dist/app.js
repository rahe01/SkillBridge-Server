import express from "express";
import cors from "cors";
import { authRoutes } from "./modules/auth/auth.router";
import { TutorRoutes } from "./modules/tutor/tutor.router";
import { BookingRoutes } from "./modules/booking/booking.router";
import { ReviewRoutes } from "./modules/student/student.router";
import { AdminRoutes } from "./modules/admin/admin.router";
import { userRoutes } from "./modules/user/user.router";
const app = express();
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use("/api/auth/", authRoutes);
app.use("/api/tutor/", TutorRoutes);
app.use("/api/bookings/", BookingRoutes);
app.use("/api/", ReviewRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/users/", userRoutes);
app.get("/", (req, res) => {
    res.send("SkillBridge Server is running 🚀");
});
app.post("/test", (req, res) => {
    console.log(req.body);
    res.send("ok");
});
export default app;
