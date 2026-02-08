
import bcrypt from "bcrypt";
import { Role, UserStatus } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";


async function main() {
  const adminEmail = "admin@skillbridge.com";

  // check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("Admin created successfully");
  console.log({
    email: admin.email,
    password: "Admin@123",
    role: admin.role,
  });
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
