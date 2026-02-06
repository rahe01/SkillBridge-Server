import { prisma } from "../../lib/prisma";
import { Role, UserStatus } from "../../../generated/prisma/enums";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateUserStatus = async (
  adminId: string,
  adminRole: Role,
  userId: string,
  status: UserStatus,
) => {
  if (adminRole !== Role.ADMIN) {
    throw new Error("Only admin can update user status");
  }

  if (![UserStatus.ACTIVE, UserStatus.BANNED].includes(status)) {
    throw new Error("Invalid user status");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user?.status === status) {
    throw new Error(`User is already ${status}`);
  }

  if (!user) throw new Error("User not found");

  if (user.role === Role.ADMIN) {
    throw new Error("Admin status cannot be changed");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};

const createCategory = async (adminRole: Role, name: string) => {
  if (adminRole !== Role.ADMIN)
    throw new Error("Only admin can create categories");

  return prisma.category.create({
    data: { name },
  });
};

const updateCategory = async (adminRole: Role, id: string, name: string) => {
  if (adminRole !== Role.ADMIN)
    throw new Error("Only admin can update categories");

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Category not found");

  return prisma.category.update({
    where: { id },
    data: { name },
  });
};

const deleteCategory = async (adminRole: Role, id: string) => {
  if (adminRole !== Role.ADMIN)
    throw new Error("Only admin can delete categories");

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Category not found");

  return prisma.category.delete({ where: { id } });
};


const getAllBookings = async () => {
  return prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tutorProfile: {
        select: {
          id: true,
          pricePerHour: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      review: {
        select: {
          rating: true,
          comment: true,
        },
      },
    },
  });
};


export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllBookings
};
