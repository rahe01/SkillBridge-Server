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
  status: UserStatus
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

  if(user?.status === status){
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

export const AdminService = {
  getAllUsers,
  updateUserStatus,
};
