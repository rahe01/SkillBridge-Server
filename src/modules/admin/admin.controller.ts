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

const parseRole = (role: string): Role => {
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





const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await AdminService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const admin = req.user;
    const { name } = req.body;
    if (!admin) throw new Error("Unauthorized");

    const adminRole = parseRole(admin.role);

    const category = await AdminService.createCategory(adminRole, name);
    res.status(201).json({ success: true, data: category });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const admin = req.user;
    const { id } = req.params;
    const { name } = req.body;
    if (!admin) throw new Error("Unauthorized");

    const adminRole = parseRole(admin.role);

    const category = await AdminService.updateCategory(adminRole, id as string, name);
    res.status(200).json({ success: true, data: category });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const admin = req.user;
    const { id } = req.params;
    if (!admin) throw new Error("Unauthorized");

    const adminRole = parseRole(admin.role);

    const category = await AdminService.deleteCategory(adminRole, id as string);
    res.status(200).json({ success: true, data: category });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};




export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};