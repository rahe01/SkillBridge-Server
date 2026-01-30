import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

/* ======================
   CREATE / UPDATE PROFILE
====================== */
const upsertTutorProfile = async (userId: string, payload: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== Role.TUTOR) {
    throw new Error("Only tutors can create or update profile");
  }

  const { bio, pricePerHour, experience, categoryIds } = payload;

  return prisma.$transaction(async (tx) => {
    const tutorProfile = await tx.tutorProfile.upsert({
      where: { userId },
      update: {
        bio,
        pricePerHour,
        experience,
      },
      create: {
        userId,
        bio,
        pricePerHour,
        experience,
      },
    });

    // Handle categories
    if (Array.isArray(categoryIds)) {
      await tx.tutorCategory.deleteMany({
        where: { tutorProfileId: tutorProfile.id },
      });

      if (categoryIds.length > 0) {
        await tx.tutorCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            tutorProfileId: tutorProfile.id,
            categoryId,
          })),
        });
      }
    }

    return tutorProfile;
  });
};

/* ======================
   SET AVAILABILITY
====================== */
const setAvailability = async (userId: string, slots: any[]) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  const availabilityData = slots.map((slot) => ({
    tutorId: tutorProfile.id,
    date: new Date(slot.date),
    startTime: slot.startTime,
    endTime: slot.endTime,
  }));

  await prisma.availability.createMany({
    data: availabilityData,
  });

  return { message: "Availability added successfully" };
};

/* ======================
   GET ALL TUTORS (PUBLIC)
====================== */
const getAllTutors = async (filters: any) => {
  const { categoryId, minPrice, maxPrice } = filters;

  const priceFilter: any = {};
  if (minPrice !== undefined) priceFilter.gte = Number(minPrice);
  if (maxPrice !== undefined) priceFilter.lte = Number(maxPrice);

  return prisma.tutorProfile.findMany({
    where: {
      ...(Object.keys(priceFilter).length > 0 && {
        pricePerHour: priceFilter,
      }),
      ...(categoryId && {
        categories: {
          some: { categoryId },
        },
      }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      categories: {
        include: { category: true },
      },
      reviews: true,
    },
  });
};

/* ======================
   GET SINGLE TUTOR
====================== */
const getTutorById = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      availability: true,
      reviews: true,
      categories: {
        include: { category: true },
      },
    },
  });

  if (!tutor) {
    throw new Error("Tutor not found");
  }

  return tutor;
};

export const TutorService = {
  upsertTutorProfile,
  setAvailability,
  getAllTutors,
  getTutorById,
};
