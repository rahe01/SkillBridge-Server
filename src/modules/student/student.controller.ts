import { Request, Response } from "express";

import { Role } from "../../../generated/prisma/enums";
import { StudentService } from "./student.service";

const createReview = async (req: Request, res: Response) => {
  try {
    
    if (!req.user) throw new Error("Unauthorized");

    const user ={
        id: req.user.id,
        role: req.user.role as Role,
    }

    const result = await StudentService.createReview(user, req.body);

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

export const StudentController = {
  createReview,
};
