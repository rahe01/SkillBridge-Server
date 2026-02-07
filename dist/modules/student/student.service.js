import { BookingStatus, Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
const createReview = async (user, payload) => {
    if (user.role !== Role.STUDENT) {
        throw new Error("Only students can give reviews");
    }
    const booking = await prisma.booking.findUnique({
        where: { id: payload.bookingId },
        include: { tutorProfile: true },
    });
    if (!booking)
        throw new Error("Booking not found");
    if (booking.studentId !== user.id) {
        throw new Error("You can only review your own booking");
    }
    if (booking.status !== BookingStatus.COMPLETED) {
        throw new Error("You can review only completed bookings");
    }
    const existingReview = await prisma.review.findUnique({
        where: { bookingId: payload.bookingId },
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
                comment: payload.comment ?? null,
            },
        });
        const stats = await tx.review.aggregate({
            where: { tutorId: booking.tutorProfileId },
            _avg: { rating: true },
            _count: { rating: true },
        });
        await tx.tutorProfile.update({
            where: { id: booking.tutorProfileId },
            data: {
                rating: stats._avg.rating || 0,
                totalReviews: stats._count.rating,
            },
        });
        return review;
    });
};
export const StudentService = {
    createReview,
};
