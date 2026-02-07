import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import config from "../../config";


export const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) => {
  const { name, email, password, role } = payload;

  if (!name || !email || !password || !role) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  if (!Object.values(Role).includes(role)) {
    throw new Error(`Invalid role. Allowed: ${Object.values(Role).join(", ")}`);
  }

  const emailLower = email.toLowerCase();

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: emailLower,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) throw new Error("Email and password required");

  const emailLower = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: emailLower },
  });

  if (!user) throw new Error("Invalid email or password");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password");

  if (user.status === UserStatus.BANNED) throw new Error("User is banned");

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret!,
    { expiresIn: "7d" }
  );

  return { token, user };
};

export const authServices = { createUser, loginUser };
