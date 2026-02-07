import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
export const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user)
        throw new Error("User not found");
    return user;
};
export const updateUser = async (userId, payload) => {
    const data = {};
    if (payload.name)
        data.name = payload.name;
    if (payload.email)
        data.email = payload.email.toLowerCase();
    if (payload.password) {
        if (payload.password.length < 6)
            throw new Error("Password must be at least 6 characters");
        data.password = await bcrypt.hash(payload.password, 10);
    }
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
};
export const userService = { getUserById, updateUser };
