import { AdminService } from "./admin.service";
import { Role } from "../../generated/prisma/enums";
const getAllUsers = async (req, res) => {
    try {
        if (req.user?.role !== Role.ADMIN) {
            throw new Error("Unauthorized");
        }
        const users = await AdminService.getAllUsers();
        res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (err) {
        res.status(403).json({
            success: false,
            message: err.message,
        });
    }
};
const updateUserStatus = async (req, res) => {
    try {
        const admin = req.user;
        if (!admin)
            throw new Error("Unauthorized");
        const { id } = req.params;
        const { status } = req.body;
        const result = await AdminService.updateUserStatus(admin.id, admin.role, id, status);
        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const parseRole = (role) => {
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
const getCategories = async (req, res) => {
    try {
        const categories = await AdminService.getAllCategories();
        res.status(200).json({ success: true, data: categories });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
const createCategory = async (req, res) => {
    try {
        const admin = req.user;
        const { name } = req.body;
        if (!admin)
            throw new Error("Unauthorized");
        const adminRole = parseRole(admin.role);
        const category = await AdminService.createCategory(adminRole, name);
        res.status(201).json({ success: true, data: category });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
const updateCategory = async (req, res) => {
    try {
        const admin = req.user;
        const { id } = req.params;
        const { name } = req.body;
        if (!admin)
            throw new Error("Unauthorized");
        const adminRole = parseRole(admin.role);
        const category = await AdminService.updateCategory(adminRole, id, name);
        res.status(200).json({ success: true, data: category });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
const deleteCategory = async (req, res) => {
    try {
        const admin = req.user;
        const { id } = req.params;
        if (!admin)
            throw new Error("Unauthorized");
        const adminRole = parseRole(admin.role);
        const category = await AdminService.deleteCategory(adminRole, id);
        res.status(200).json({ success: true, data: category });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
const getAllBookings = async (req, res) => {
    try {
        const admin = req.user;
        if (!admin || admin.role !== Role.ADMIN) {
            throw new Error("Unauthorized");
        }
        const bookings = await AdminService.getAllBookings();
        res.status(200).json({
            success: true,
            data: bookings,
        });
    }
    catch (err) {
        res.status(403).json({
            success: false,
            message: err.message,
        });
    }
};
const getDashboardStats = async (req, res) => {
    try {
        // from auth middleware
        const stats = await AdminService.getAdminDashboardStats();
        res.status(200).json({
            success: true,
            message: "Admin dashboard statistics fetched successfully",
            data: stats,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export const AdminController = {
    getAllUsers,
    updateUserStatus,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllBookings,
    getDashboardStats
};
