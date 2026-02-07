import { Role, UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

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


const getAdminDashboardStats = async () => {
  

  const [
    totalUsers,
    totalStudents,
    totalTutors,
    activeUsers,
    bannedUsers,
    totalCategories,
    totalTutorProfiles,
    totalBookings,
    bookingStats,
    totalReviews,
    avgRating,
    recentBookings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({ where: { role: Role.TUTOR } }),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "BANNED" } }),
    prisma.category.count(),
    prisma.tutorProfile.count(),
    prisma.booking.count(),

    prisma.booking.groupBy({
      by: ["status"],
      _count: { status: true },
    }),

    prisma.review.count(),

    prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    }),

    prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(
            new Date().setDate(new Date().getDate() - 7)
          ),
        },
      },
    }),
  ]);

  const bookingStatusCount = {
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };

  bookingStats.forEach((item) => {
    bookingStatusCount[item.status] = item._count.status;
  });

  return {
    users: {
      total: totalUsers,
      students: totalStudents,
      tutors: totalTutors,
      active: activeUsers,
      banned: bannedUsers,
    },
    tutors: {
      totalProfiles: totalTutorProfiles,
      averageRating: avgRating._avg.rating ?? 0,
    },
    categories: {
      total: totalCategories,
    },
    bookings: {
      total: totalBookings,
      byStatus: bookingStatusCount,
      last7Days: recentBookings,
    },
    reviews: {
      total: totalReviews,
    },
  };
};


export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllBookings,
   getAdminDashboardStats,
};
