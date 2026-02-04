import { Request, Response } from "express";
import { userService } from "./user.service";

// Get current user
const getUser = async (req: Request, res: Response) => {
  try {
   
    const userId = req.user?.id;
    if (!userId) throw new Error("User not authenticated");

    const user = await userService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update current user
const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("User not authenticated");

    const { name, email, password } = req.body;

    const updatedUser = await userService.updateUser(userId, { name, email, password });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const userController = { getUser, updateUser };
