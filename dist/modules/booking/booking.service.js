import { BookingStatus, Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
const createBooking = async (studentId, payload) => {
    const { tutorProfileId, date, startTime, endTime } = payload;
    const tutor = await prisma.tutorProfile.findUnique({
        where: { id: tutorProfileId },
        include: { availability: true },
    });
    if (!tutor)
        throw new Error("Tutor not found");
    const slotAvailable = tutor.availability.find((slot) => slot.date.toISOString().split("T")[0] === date &&
        slot.startTime === startTime &&
        slot.endTime === endTime &&
        !slot.isBooked);
    if (!slotAvailable)
        throw new Error("Selected slot is not available");
    await prisma.availability.update({
        where: { id: slotAvailable.id },
        data: { isBooked: true },
    });
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
const getBookings = async (userId, role) => {
    if (role === "STUDENT") {
        return prisma.booking.findMany({
            where: { studentId: userId },
            include: { tutorProfile: { include: { user: true } } },
            orderBy: { date: "desc" },
        });
    }
    else if (role === "TUTOR") {
        return prisma.booking.findMany({
            where: { tutorProfile: { userId } },
            include: { student: true, tutorProfile: true },
            orderBy: { date: "desc" },
        });
    }
    else {
        throw new Error("Invalid role");
    }
};
const getBookingById = async (id) => {
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            student: true,
            tutorProfile: { include: { user: true } },
            review: true,
        },
    });
    if (!booking)
        throw new Error("Booking not found");
    return booking;
};
const updateBookingStatus = async (id, newStatus, currentUser) => {
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            tutorProfile: true,
            student: true,
        },
    });
    if (!booking) {
        throw new Error("Booking not found");
    }
    if (booking.status === BookingStatus.COMPLETED ||
        booking.status === BookingStatus.CANCELLED) {
        throw new Error(`Booking is already ${booking.status} and cannot be updated`);
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
                endTime: booking.endTime,
            },
            data: { isBooked: false },
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
    if (currentUser.role !== Role.ADMIN &&
        currentUser.role !== Role.STUDENT &&
        currentUser.role !== Role.TUTOR) {
        throw new Error("You are not authorized to update this booking");
    }
    const updatedBooking = await prisma.booking.update({
        where: { id },
        data: { status: newStatus },
        include: {
            student: true,
            tutorProfile: true,
        },
    });
    return updatedBooking;
};
export const BookingService = {
    createBooking,
    getBookings,
    getBookingById,
    updateBookingStatus,
};
