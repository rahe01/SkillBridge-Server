import { prisma } from "../../lib/prisma";
import { BookingStatus, Role } from "../../../generated/prisma/enums";

/* ======================
   CREATE NEW BOOKING
====================== */
const createBooking = async (studentId: string, payload: any) => {
  const { tutorProfileId, date, startTime, endTime } = payload;

  // check if tutor exists
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    include: { availability: true },
  });

  if (!tutor) throw new Error("Tutor not found");

  // check if slot is available
  const slotAvailable = tutor.availability.find(
    (slot) =>
      slot.date.toISOString().split("T")[0] === date &&
      slot.startTime === startTime &&
      slot.endTime === endTime &&
      !slot.isBooked
  );

  if (!slotAvailable) throw new Error("Selected slot is not available");

  // mark slot as booked
  await prisma.availability.update({
    where: { id: slotAvailable.id },
    data: { isBooked: true },
  });

  // create booking
  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorProfileId,
      date: new Date(date),
      startTime,
      endTime,
      status: BookingStatus.CONFIRMED,
    },
    include: {
      student: true,
      tutorProfile: true,
    },
  });

  return booking;
};

/* ======================
   GET ALL BOOKINGS FOR A USER
====================== */
const getBookings = async (userId: string, role: string) => {
  if (role === "STUDENT") {
    return prisma.booking.findMany({
      where: { studentId: userId },
      include: { tutorProfile: { include: { user: true } } },
      orderBy: { date: "desc" },
    });
  } else if (role === "TUTOR") {
    return prisma.booking.findMany({
      where: { tutorProfile: { userId } },
      include: { student: true, tutorProfile: true },
      orderBy: { date: "desc" },
    });
  } else {
    throw new Error("Invalid role");
  }
};

/* ======================
   GET SINGLE BOOKING BY ID
====================== */
const getBookingById = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      student: true,
      tutorProfile: { include: { user: true } },
      review: true,
    },
  });

  if (!booking) throw new Error("Booking not found");
  return booking;
};

/* ======================
   UPDATE BOOKING STATUS
====================== */

const updateBookingStatus = async (
  id: string,
  newStatus: BookingStatus,
  currentUser: { id: string; role: Role }
) => {
  
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { tutorProfile: true, student: true },
  });

  if (!booking) throw new Error("Booking not found");

 
  if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
    throw new Error(`Booking is already ${booking.status} and cannot be updated`);
  }

 
  if (
    currentUser.role === Role.STUDENT &&
    newStatus === BookingStatus.CANCELLED &&
    booking.studentId !== currentUser.id
  ) {
    throw new Error("Students can only cancel their own bookings");
  }

 
  if (
    currentUser.role === Role.TUTOR &&
    newStatus === BookingStatus.COMPLETED &&
    booking.tutorProfile.userId !== currentUser.id
  ) {
    throw new Error("Tutors can only complete their own bookings");
  }


  if (
    currentUser.role !== Role.ADMIN &&
    !(
      (currentUser.role === Role.STUDENT && newStatus === BookingStatus.CANCELLED) ||
      (currentUser.role === Role.TUTOR && newStatus === BookingStatus.COMPLETED)
    )
  ) {
    throw new Error("You are not authorized to update this booking");
  }

  
  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: { status: newStatus },
    include: { student: true, tutorProfile: true },
  });

  return updatedBooking;
};



/* ======================
   EXPORT SERVICE
====================== */
export const BookingService = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
};
