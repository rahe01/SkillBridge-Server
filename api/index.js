// src/app.ts
import express from "express";
import cors from "cors";

// src/modules/auth/auth.router.ts
import { Router } from "express";

// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// src/generated/prisma/enums.ts
var Role = {
  STUDENT: "STUDENT",
  TUTOR: "TUTOR",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED"
};
var BookingStatus = {
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n/**\n * =====\n * ENUMS\n * ======\n */\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\n/**\n * =======\n * USER\n * =========\n */\n\nmodel User {\n  id       String     @id @default(uuid())\n  name     String\n  email    String     @unique\n  password String\n  role     Role\n  status   UserStatus @default(ACTIVE)\n\n  // Relations\n  tutorProfile      TutorProfile?\n  bookingsAsStudent Booking[]     @relation("StudentBookings")\n  reviews           Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\n/**\n * =========\n * TUTOR PROFILE\n * ============\n */\n\nmodel TutorProfile {\n  id           String  @id @default(uuid())\n  userId       String  @unique\n  bio          String?\n  pricePerHour Float\n  experience   Int // years\n  rating       Float   @default(0)\n  totalReviews Int     @default(0)\n\n  // Relations\n  user         User            @relation(fields: [userId], references: [id])\n  categories   TutorCategory[]\n  availability Availability[]\n  bookings     Booking[]\n  reviews      Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\n/**\n * =========\n * CATEGORY\n * ==========\n */\n\nmodel Category {\n  id   String @id @default(uuid())\n  name String @unique\n\n  tutors TutorCategory[]\n}\n\n/**\n * =========\n * TUTOR \u2194 CATEGORY\n * ==========\n */\n\nmodel TutorCategory {\n  tutorProfileId String\n  categoryId     String\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  category     Category     @relation(fields: [categoryId], references: [id])\n\n  @@id([tutorProfileId, categoryId])\n}\n\n/**\n * =======\n * AVAILABILITY\n * ==========\n */\n\nmodel Availability {\n  id        String   @id @default(uuid())\n  tutorId   String\n  date      DateTime\n  startTime String\n  endTime   String\n  isBooked  Boolean  @default(false)\n\n  tutor TutorProfile @relation(fields: [tutorId], references: [id])\n\n  createdAt DateTime @default(now())\n}\n\n/**\n * ==========\n * BOOKING\n * ============\n */\n\nmodel Booking {\n  id             String        @id @default(uuid())\n  studentId      String\n  tutorProfileId String\n  date           DateTime\n  startTime      String\n  endTime        String\n  status         BookingStatus @default(CONFIRMED)\n\n  // Relations\n  student      User         @relation("StudentBookings", fields: [studentId], references: [id])\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  review       Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\n/**\n * =========\n * REVIEW\n * ==========\n */\n\nmodel Review {\n  id        String  @id @default(uuid())\n  bookingId String  @unique\n  studentId String\n  tutorId   String\n  rating    Int\n  comment   String?\n\n  booking Booking      @relation(fields: [bookingId], references: [id])\n  student User         @relation(fields: [studentId], references: [id])\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id])\n\n  createdAt DateTime @default(now())\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"bookingsAsStudent","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"pricePerHour","kind":"scalar","type":"Float"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"}],"dbName":null},"TutorCategory":{"fields":[{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/config/index.ts
import dotenv from "dotenv";
import path2 from "path";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config2 = {
  connection_str: process.env.DATABASE_URL,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET
};
var config_default = config2;

// src/modules/auth/auth.service.ts
var createUser = async (payload) => {
  const { name, email, password, role } = payload;
  if (!name || !email || !password || !role) {
    throw new Error("All fields are required");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  if (!Object.values(Role).includes(role)) {
    throw new Error(`Invalid role. Allowed: ${Object.values(Role).join(", ")}`);
  }
  const emailLower = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email: emailLower,
      password: hashedPassword,
      role
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    }
  });
  return user;
};
var loginUser = async (email, password) => {
  if (!email || !password) throw new Error("Email and password required");
  const emailLower = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: emailLower }
  });
  if (!user) throw new Error("Invalid email or password");
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password");
  if (user.status === UserStatus.BANNED) throw new Error("User is banned");
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config_default.jwtSecret,
    { expiresIn: "7d" }
  );
  return { token, user };
};
var authServices = { createUser, loginUser };

// src/modules/auth/auth.controller.ts
var createUser2 = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    const user = await authServices.createUser({ name, email, password, role });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
var loginUser2 = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authServices.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
var authController = { createUser: createUser2, loginUser: loginUser2 };

// src/modules/auth/auth.router.ts
var router = Router();
router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);
var authRoutes = router;

// src/modules/tutor/tutor.router.ts
import { Router as Router2 } from "express";

// src/modules/tutor/tutor.service.ts
var upsertTutorProfile = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user || user.role !== Role.TUTOR) {
    throw new Error("Only tutors can create or update profile");
  }
  const { bio, pricePerHour, experience, categoryIds } = payload;
  return prisma.$transaction(async (tx) => {
    const tutorProfile = await tx.tutorProfile.upsert({
      where: { userId },
      update: {
        bio,
        pricePerHour,
        experience
      },
      create: {
        userId,
        bio,
        pricePerHour,
        experience
      }
    });
    if (Array.isArray(categoryIds)) {
      await tx.tutorCategory.deleteMany({
        where: { tutorProfileId: tutorProfile.id }
      });
      if (categoryIds.length > 0) {
        await tx.tutorCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            tutorProfileId: tutorProfile.id,
            categoryId
          }))
        });
      }
    }
    return tutorProfile;
  });
};
var setAvailability = async (userId, slots) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }
  return prisma.$transaction(async (tx) => {
    await tx.availability.deleteMany({
      where: { tutorId: tutorProfile.id }
    });
    const data = slots.map((slot) => ({
      tutorId: tutorProfile.id,
      date: new Date(slot.date),
      startTime: slot.startTime,
      endTime: slot.endTime
    }));
    await tx.availability.createMany({ data });
    return { message: "Availability updated successfully" };
  });
};
var getAllTutors = async (filters) => {
  const { categoryId, minPrice, maxPrice, rating } = filters;
  const priceFilter = {};
  if (minPrice !== void 0) priceFilter.gte = Number(minPrice);
  if (maxPrice !== void 0) priceFilter.lte = Number(maxPrice);
  const ratingFilter = {};
  if (rating !== void 0) ratingFilter.gte = Number(rating);
  const tutors = await prisma.tutorProfile.findMany({
    where: {
      ...Object.keys(priceFilter).length > 0 && { pricePerHour: priceFilter },
      ...Object.keys(ratingFilter).length > 0 && { rating: ratingFilter },
      ...categoryId ? {
        categories: {
          some: { categoryId }
        }
      } : {}
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      categories: { include: { category: true } },
      reviews: true
    }
  });
  return tutors;
};
var getTutorById = async (id) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      availability: true,
      reviews: true,
      categories: {
        include: { category: true }
      }
    }
  });
  if (!tutor) {
    throw new Error("Tutor not found");
  }
  return tutor;
};
var getFeaturedTutors = async () => {
  const tutors = await prisma.tutorProfile.findMany({
    where: {
      experience: {
        gte: 5
      }
    },
    include: {
      user: true,
      categories: {
        include: { category: true }
      }
    },
    take: 6
  });
  return tutors;
};
var getTutorBookedSessions = async (userId) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }
  const sessions = await prisma.booking.findMany({
    where: { tutorProfileId: tutorProfile.id },
    include: {
      student: { select: { id: true, name: true, email: true } },
      review: true
    },
    orderBy: { date: "asc" }
  });
  return sessions.map((s) => ({
    id: s.id,
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    status: s.status,
    student: s.student,
    review: s.review
  }));
};
var TutorService = {
  upsertTutorProfile,
  setAvailability,
  getAllTutors,
  getTutorById,
  getFeaturedTutors,
  getTutorBookedSessions
};

// src/modules/tutor/tutor.controller.ts
var upsertProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const result = await TutorService.upsertTutorProfile(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Tutor profile saved successfully",
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
var setAvailability2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const { slots } = req.body;
    if (!Array.isArray(slots)) {
      throw new Error("Slots must be an array");
    }
    const result = await TutorService.setAvailability(userId, slots);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
var getTutors = async (req, res) => {
  try {
    const filters = {
      categoryId: req.query.categoryId,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : void 0,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : void 0
    };
    const tutors = await TutorService.getAllTutors(filters);
    res.status(200).json({
      success: true,
      data: tutors
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
var getTutor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Tutor id is required");
    const tutor = await TutorService.getTutorById(id);
    res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message
    });
  }
};
var getFeaturedTutor = async (req, res) => {
  try {
    const tutor = await TutorService.getFeaturedTutors();
    res.status(200).json({
      success: true,
      data: tutor
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message
    });
  }
};
var getBookedSessions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const sessions = await TutorService.getTutorBookedSessions(userId);
    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
var TutorController = {
  upsertProfile,
  setAvailability: setAvailability2,
  getTutors,
  getTutor,
  getFeaturedTutor,
  getBookedSessions
};

// src/middlewares/auth.middleware.ts
import jwt2 from "jsonwebtoken";
var authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt2.verify(token, config_default.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// src/modules/tutor/tutor.router.ts
var router2 = Router2();
router2.post("/profile", authenticate, TutorController.upsertProfile);
router2.put("/profile", authenticate, TutorController.upsertProfile);
router2.post("/availability", authenticate, TutorController.setAvailability);
router2.get("/", TutorController.getTutors);
router2.get("/featured", TutorController.getFeaturedTutor);
router2.get("/:id", TutorController.getTutor);
router2.get("/sessions/booked", authenticate, TutorController.getBookedSessions);
var TutorRoutes = router2;

// src/modules/booking/booking.router.ts
import { Router as Router3 } from "express";

// src/modules/booking/booking.service.ts
var createBooking = async (studentId, payload) => {
  const { tutorProfileId, date, startTime, endTime } = payload;
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    include: { availability: true }
  });
  if (!tutor) throw new Error("Tutor not found");
  const slotAvailable = tutor.availability.find(
    (slot) => slot.date.toISOString().split("T")[0] === date && slot.startTime === startTime && slot.endTime === endTime && !slot.isBooked
  );
  if (!slotAvailable) throw new Error("Selected slot is not available");
  await prisma.availability.update({
    where: { id: slotAvailable.id },
    data: { isBooked: true }
  });
  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorProfileId,
      date: new Date(date),
      startTime,
      endTime,
      status: BookingStatus.CONFIRMED
    },
    include: {
      student: true,
      tutorProfile: true
    }
  });
  return booking;
};
var getBookings = async (userId, role) => {
  if (role === "STUDENT") {
    return prisma.booking.findMany({
      where: { studentId: userId },
      include: { tutorProfile: { include: { user: true } } },
      orderBy: { date: "desc" }
    });
  } else if (role === "TUTOR") {
    return prisma.booking.findMany({
      where: { tutorProfile: { userId } },
      include: { student: true, tutorProfile: true },
      orderBy: { date: "desc" }
    });
  } else {
    throw new Error("Invalid role");
  }
};
var getBookingById = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      student: true,
      tutorProfile: { include: { user: true } },
      review: true
    }
  });
  if (!booking) throw new Error("Booking not found");
  return booking;
};
var updateBookingStatus = async (id, newStatus, currentUser) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      tutorProfile: true,
      student: true
    }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
    throw new Error(
      `Booking is already ${booking.status} and cannot be updated`
    );
  }
  if (currentUser.role === Role.STUDENT) {
    if (newStatus !== BookingStatus.CANCELLED) {
      throw new Error("Student can only cancel a booking");
    }
    if (booking.studentId !== currentUser.id) {
      throw new Error("Students can only cancel their own bookings");
    }
    await prisma.availability.updateMany({
      where: {
        tutorId: booking.tutorProfile.id,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime
      },
      data: { isBooked: false }
    });
  }
  if (currentUser.role === Role.TUTOR) {
    if (newStatus !== BookingStatus.COMPLETED) {
      throw new Error("Tutor can only complete a booking");
    }
    if (booking.tutorProfile.userId !== currentUser.id) {
      throw new Error("Tutors can only complete their own bookings");
    }
  }
  if (currentUser.role !== Role.ADMIN && currentUser.role !== Role.STUDENT && currentUser.role !== Role.TUTOR) {
    throw new Error("You are not authorized to update this booking");
  }
  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: { status: newStatus },
    include: {
      student: true,
      tutorProfile: true
    }
  });
  return updatedBooking;
};
var BookingService = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus
};

// src/modules/booking/booking.controller.ts
var createBooking2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const booking = await BookingService.createBooking(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var getBookings2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) throw new Error("Unauthorized");
    const bookings = await BookingService.getBookings(userId, role);
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var getBookingById2 = async (req, res) => {
  try {
    const booking = await BookingService.getBookingById(
      req.params.id
    );
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};
var updateBookingStatus2 = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await BookingService.updateBookingStatus(
      req.params.id,
      status,
      req.user
    );
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var BookingController = {
  createBooking: createBooking2,
  getBookings: getBookings2,
  getBookingById: getBookingById2,
  updateBookingStatus: updateBookingStatus2
};

// src/modules/booking/booking.router.ts
var router3 = Router3();
router3.post("/", authenticate, BookingController.createBooking);
router3.get("/", authenticate, BookingController.getBookings);
router3.get("/:id", authenticate, BookingController.getBookingById);
router3.patch(
  "/:id/status",
  authenticate,
  BookingController.updateBookingStatus
);
var BookingRoutes = router3;

// src/modules/student/student.router.ts
import { Router as Router4 } from "express";

// src/modules/student/student.service.ts
var createReview = async (user, payload) => {
  if (user.role !== Role.STUDENT) {
    throw new Error("Only students can give reviews");
  }
  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId },
    include: { tutorProfile: true }
  });
  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== user.id) {
    throw new Error("You can only review your own booking");
  }
  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("You can review only completed bookings");
  }
  const existingReview = await prisma.review.findUnique({
    where: { bookingId: payload.bookingId }
  });
  if (existingReview) {
    throw new Error("Review already submitted for this booking");
  }
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        bookingId: payload.bookingId,
        studentId: user.id,
        tutorId: booking.tutorProfileId,
        rating: payload.rating,
        comment: payload.comment ?? null
      }
    });
    const stats = await tx.review.aggregate({
      where: { tutorId: booking.tutorProfileId },
      _avg: { rating: true },
      _count: { rating: true }
    });
    await tx.tutorProfile.update({
      where: { id: booking.tutorProfileId },
      data: {
        rating: stats._avg.rating || 0,
        totalReviews: stats._count.rating
      }
    });
    return review;
  });
};
var StudentService = {
  createReview
};

// src/modules/student/student.controller.ts
var createReview2 = async (req, res) => {
  try {
    if (!req.user) throw new Error("Unauthorized");
    const user = {
      id: req.user.id,
      role: req.user.role
    };
    const result = await StudentService.createReview(user, req.body);
    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
var StudentController = {
  createReview: createReview2
};

// src/modules/student/student.router.ts
var router4 = Router4();
router4.post("/reviews", authenticate, StudentController.createReview);
var ReviewRoutes = router4;

// src/modules/admin/admin.router.ts
import { Router as Router5 } from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var updateUserStatus = async (adminId, adminRole, userId, status) => {
  if (adminRole !== Role.ADMIN) {
    throw new Error("Only admin can update user status");
  }
  if (![UserStatus.ACTIVE, UserStatus.BANNED].includes(status)) {
    throw new Error("Invalid user status");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (user?.status === status) {
    throw new Error(`User is already ${status}`);
  }
  if (!user) throw new Error("User not found");
  if (user.role === Role.ADMIN) {
    throw new Error("Admin status cannot be changed");
  }
  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true
    }
  });
};
var getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" }
  });
};
var createCategory = async (adminRole, name) => {
  if (adminRole !== Role.ADMIN)
    throw new Error("Only admin can create categories");
  return prisma.category.create({
    data: { name }
  });
};
var updateCategory = async (adminRole, id, name) => {
  if (adminRole !== Role.ADMIN)
    throw new Error("Only admin can update categories");
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Category not found");
  return prisma.category.update({
    where: { id },
    data: { name }
  });
};
var deleteCategory = async (adminRole, id) => {
  if (adminRole !== Role.ADMIN)
    throw new Error("Only admin can delete categories");
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Category not found");
  return prisma.category.delete({ where: { id } });
};
var getAllBookings = async () => {
  return prisma.booking.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      tutorProfile: {
        select: {
          id: true,
          pricePerHour: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      review: {
        select: {
          rating: true,
          comment: true
        }
      }
    }
  });
};
var getAdminDashboardStats = async () => {
  const [
    totalUsers,
    totalStudents,
    totalTutors,
    activeUsers,
    bannedUsers,
    totalCategories,
    totalTutorProfiles,
    totalBookings,
    bookingStats,
    totalReviews,
    avgRating,
    recentBookings
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({ where: { role: Role.TUTOR } }),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "BANNED" } }),
    prisma.category.count(),
    prisma.tutorProfile.count(),
    prisma.booking.count(),
    prisma.booking.groupBy({
      by: ["status"],
      _count: { status: true }
    }),
    prisma.review.count(),
    prisma.review.aggregate({
      _avg: {
        rating: true
      }
    }),
    prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(
            (/* @__PURE__ */ new Date()).setDate((/* @__PURE__ */ new Date()).getDate() - 7)
          )
        }
      }
    })
  ]);
  const bookingStatusCount = {
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0
  };
  bookingStats.forEach((item) => {
    bookingStatusCount[item.status] = item._count.status;
  });
  return {
    users: {
      total: totalUsers,
      students: totalStudents,
      tutors: totalTutors,
      active: activeUsers,
      banned: bannedUsers
    },
    tutors: {
      totalProfiles: totalTutorProfiles,
      averageRating: avgRating._avg.rating ?? 0
    },
    categories: {
      total: totalCategories
    },
    bookings: {
      total: totalBookings,
      byStatus: bookingStatusCount,
      last7Days: recentBookings
    },
    reviews: {
      total: totalReviews
    }
  };
};
var AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllBookings,
  getAdminDashboardStats
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    if (req.user?.role !== Role.ADMIN) {
      throw new Error("Unauthorized");
    }
    const users = await AdminService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err.message
    });
  }
};
var updateUserStatus2 = async (req, res) => {
  try {
    const admin = req.user;
    if (!admin) throw new Error("Unauthorized");
    const { id } = req.params;
    const { status } = req.body;
    const result = await AdminService.updateUserStatus(
      admin.id,
      admin.role,
      id,
      status
    );
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
var parseRole = (role) => {
  switch (role) {
    case "ADMIN":
      return Role.ADMIN;
    case "TUTOR":
      return Role.TUTOR;
    case "STUDENT":
      return Role.STUDENT;
    default:
      throw new Error("Invalid role");
  }
};
var getCategories = async (req, res) => {
  try {
    const categories = await AdminService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var createCategory2 = async (req, res) => {
  try {
    const admin = req.user;
    const { name } = req.body;
    if (!admin) throw new Error("Unauthorized");
    const adminRole = parseRole(admin.role);
    const category = await AdminService.createCategory(adminRole, name);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const admin = req.user;
    const { id } = req.params;
    const { name } = req.body;
    if (!admin) throw new Error("Unauthorized");
    const adminRole = parseRole(admin.role);
    const category = await AdminService.updateCategory(adminRole, id, name);
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const admin = req.user;
    const { id } = req.params;
    if (!admin) throw new Error("Unauthorized");
    const adminRole = parseRole(admin.role);
    const category = await AdminService.deleteCategory(adminRole, id);
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var getAllBookings2 = async (req, res) => {
  try {
    const admin = req.user;
    if (!admin || admin.role !== Role.ADMIN) {
      throw new Error("Unauthorized");
    }
    const bookings = await AdminService.getAllBookings();
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err.message
    });
  }
};
var getDashboardStats = async (req, res) => {
  try {
    const stats = await AdminService.getAdminDashboardStats();
    res.status(200).json({
      success: true,
      message: "Admin dashboard statistics fetched successfully",
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var AdminController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  getCategories,
  createCategory: createCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2,
  getAllBookings: getAllBookings2,
  getDashboardStats
};

// src/modules/admin/admin.router.ts
var router5 = Router5();
router5.get("/users", authenticate, AdminController.getAllUsers);
router5.patch(
  "/users/:id",
  authenticate,
  AdminController.updateUserStatus
);
router5.get("/categories", AdminController.getCategories);
router5.post("/categories", authenticate, AdminController.createCategory);
router5.put("/categories/:id", authenticate, AdminController.updateCategory);
router5.delete("/categories/:id", authenticate, AdminController.deleteCategory);
router5.get("/bookings", authenticate, AdminController.getAllBookings);
router5.get(
  "/dashboard-stats",
  authenticate,
  AdminController.getDashboardStats
);
var AdminRoutes = router5;

// src/modules/user/user.router.ts
import { Router as Router6 } from "express";

// src/modules/user/user.service.ts
import bcrypt2 from "bcryptjs";
var getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!user) throw new Error("User not found");
  return user;
};
var updateUser = async (userId, payload) => {
  const data = {};
  if (payload.name) data.name = payload.name;
  if (payload.email) data.email = payload.email.toLowerCase();
  if (payload.password) {
    if (payload.password.length < 6)
      throw new Error("Password must be at least 6 characters");
    data.password = await bcrypt2.hash(payload.password, 10);
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return updatedUser;
};
var userService = { getUserById, updateUser };

// src/modules/user/user.controller.ts
var getUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("User not authenticated");
    const user = await userService.getUserById(userId);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var updateUser2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("User not authenticated");
    const { name, email, password } = req.body;
    const updatedUser = await userService.updateUser(userId, { name, email, password });
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var userController = { getUser, updateUser: updateUser2 };

// src/modules/user/user.router.ts
var router6 = Router6();
router6.get("/me", authenticate, userController.getUser);
router6.patch("/me", authenticate, userController.updateUser);
var userRoutes = router6;

// src/app.ts
var app = express();
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  "https://skillbridge-frontend-omega.vercel.app"
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use("/api/auth/", authRoutes);
app.use("/api/tutor/", TutorRoutes);
app.use("/api/bookings/", BookingRoutes);
app.use("/api/", ReviewRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/users/", userRoutes);
app.get("/", (req, res) => {
  res.send("SkillBridge Server is running \u{1F680}");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
