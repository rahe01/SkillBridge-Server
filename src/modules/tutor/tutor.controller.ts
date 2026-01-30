import { Request, Response } from "express";
import { TutorService } from "./tutor.service";

const upsertProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const result = await TutorService.upsertTutorProfile(
      userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Tutor profile saved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const setAvailability = async (req: Request, res: Response) => {
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
      message: result.message,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getTutors = async (req: Request, res: Response) => {
  const filters = {
    subject: req.query.subject as string | undefined,
    location: req.query.location as string | undefined,
    minRate: req.query.minRate
      ? Number(req.query.minRate)
      : undefined,
  };

  const tutors = await TutorService.getAllTutors(filters);

  res.status(200).json({
    success: true,
    data: tutors,
  });
};

const getTutor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Tutor id is required",
      });
    }

    const tutor = await TutorService.getTutorById(id as string);

    res.status(200).json({
      success: true,
      data: tutor,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const TutorController = {
  upsertProfile,
  setAvailability,
  getTutors,
  getTutor,
};
