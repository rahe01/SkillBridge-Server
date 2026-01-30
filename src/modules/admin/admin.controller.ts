import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { Role, UserStatus } from "../../../generated/prisma/enums";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== Role.ADMIN) {
      throw new Error("Unauthorized");
    }

    const users = await AdminService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err: any) {
    res.status(403).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const admin = req.user;
    if (!admin) throw new Error("Unauthorized");

    const { id } = req.params;
    const { status } = req.body;

    const result = await AdminService.updateUserStatus(
      admin.id,
      admin.role as Role,
      id as string,
      status as UserStatus
    );

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const AdminController = {
  getAllUsers,
  updateUserStatus,
};
