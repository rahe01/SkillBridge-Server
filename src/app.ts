import express, { Application } from "express";
import cors from "cors";
import { authRoutes } from "./modules/auth/auth.router";
import { TutorRoutes } from "./modules/tutor/tutor.router";
import { BookingRoutes } from "./modules/booking/booking.router";
import { ReviewRoutes } from "./modules/student/student.router";
import { AdminRoutes } from "./modules/admin/admin.router";
import { userRoutes } from "./modules/user/user.router";

const app: Application = express();

// Configure CORS
const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  "https://skillbridge-frontend-omega.vercel.app",
  
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.use("/api/auth/", authRoutes);
app.use("/api/tutor/", TutorRoutes);
app.use("/api/bookings/", BookingRoutes);
app.use("/api/", ReviewRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/users/", userRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("SkillBridge Server is running 🚀");
});



export default app;
