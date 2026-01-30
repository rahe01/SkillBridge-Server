import { Request, Response } from "express";
import { ReviewService } from "./student.service";
import { Role } from "../../../generated/prisma/enums";

const createReview = async (req: Request, res: Response) => {
  try {
    
    if (!req.user) throw new Error("Unauthorized");

    const user ={
        id: req.user.id,
        role: req.user.role as Role,
    }

    const result = await ReviewService.createReview(user, req.body);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const ReviewController = {
  createReview,
};
