import express from "express";
import cors from "cors";
import { authRoutes } from "./modules/auth/auth.router";
import { TutorRoutes } from "./modules/tutor/tutor.router";

const app = express();


app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true,
}));


app.use(express.json());  


app.use("/api/auth/", authRoutes);
app.use("/api/tutor/" , TutorRoutes);

app.get("/", (req, res) => {
  res.send("SkillBridge Server is running 🚀");
});

app.post("/test", (req, res) => {
  console.log(req.body);
  res.send("ok");
});


export default app;
