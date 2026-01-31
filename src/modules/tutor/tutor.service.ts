import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";





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





const setAvailability = async (userId: string, slots: any[]) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  return prisma.$transaction(async (tx) => {
    
    await tx.availability.deleteMany({
      where: { tutorId: tutorProfile.id },
    });

   
    const data = slots.map((slot) => ({
      tutorId: tutorProfile.id,
      date: new Date(slot.date),
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    await tx.availability.createMany({ data });

    return { message: "Availability updated successfully" };
  });
};


const getAllTutors = async (filters: any) => {
  const { categoryId, minPrice, maxPrice, rating } = filters;

  const priceFilter: any = {};
  if (minPrice !== undefined) priceFilter.gte = Number(minPrice);
  if (maxPrice !== undefined) priceFilter.lte = Number(maxPrice);

  const ratingFilter: any = {};
  if (rating !== undefined) ratingFilter.gte = Number(rating);

  const tutors = await prisma.tutorProfile.findMany({
    where: {
      ...(Object.keys(priceFilter).length > 0 && { pricePerHour: priceFilter }),
      ...(Object.keys(ratingFilter).length > 0 && { rating: ratingFilter }),
      ...(categoryId
        ? {
            categories: {
              some: { categoryId },
            },
          }
        : {}),
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      categories: { include: { category: true } },
      reviews: true,
    },
  });

  return tutors;
};



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



const getFeaturedTutors = async () => {

  const tutors = await prisma.tutorProfile.findMany({
    where:{
      experience:{
        gte:5
      }
    },

    include:{
      user:true,
      categories:{
        include:{category:true}
      }
     
    },
    take:6
  })

  return tutors;





}

export const TutorService = {
  upsertTutorProfile,
  setAvailability,
  getAllTutors,
  getTutorById,
  getFeaturedTutors
};
