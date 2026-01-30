import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { BookingStatus, Role } from "../../../generated/prisma/enums";

const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const booking = await BookingService.createBooking(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) throw new Error("Unauthorized");

    const bookings = await BookingService.getBookings(userId, role);

    res.status(200).json({ success: true, data: bookings });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await BookingService.getBookingById(req.params.id as string);

    res.status(200).json({ success: true, data: booking });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body; 
    const booking = await BookingService.updateBookingStatus(
      req.params.id as string,
      status as BookingStatus,
      req.user as {id:string , role:Role}
    );

    res.status(200).json({ success: true, data: booking });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};



export const BookingController = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
};
