import { BookingService } from "./booking.service";
const createBooking = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const booking = await BookingService.createBooking(userId, req.body);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
const getBookings = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        if (!userId || !role)
            throw new Error("Unauthorized");
        const bookings = await BookingService.getBookings(userId, role);
        res.status(200).json({ success: true, data: bookings });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
const getBookingById = async (req, res) => {
    try {
        const booking = await BookingService.getBookingById(req.params.id);
        res.status(200).json({ success: true, data: booking });
    }
    catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await BookingService.updateBookingStatus(req.params.id, status, req.user);
        res.status(200).json({ success: true, data: booking });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
export const BookingController = {
    createBooking,
    getBookings,
    getBookingById,
    updateBookingStatus,
};
