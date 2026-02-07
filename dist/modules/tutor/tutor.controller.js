import { TutorService } from "./tutor.service";
const upsertProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const result = await TutorService.upsertTutorProfile(userId, req.body);
        res.status(200).json({
            success: true,
            message: "Tutor profile saved successfully",
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
const setAvailability = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { slots } = req.body;
        if (!Array.isArray(slots)) {
            throw new Error("Slots must be an array");
        }
        const result = await TutorService.setAvailability(userId, slots);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const getTutors = async (req, res) => {
    try {
        const filters = {
            categoryId: req.query.categoryId,
            minPrice: req.query.minPrice
                ? Number(req.query.minPrice)
                : undefined,
            maxPrice: req.query.maxPrice
                ? Number(req.query.maxPrice)
                : undefined,
        };
        const tutors = await TutorService.getAllTutors(filters);
        res.status(200).json({
            success: true,
            data: tutors,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const getTutor = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new Error("Tutor id is required");
        const tutor = await TutorService.getTutorById(id);
        res.status(200).json({
            success: true,
            data: tutor,
        });
    }
    catch (err) {
        res.status(404).json({
            success: false,
            message: err.message,
        });
    }
};
const getFeaturedTutor = async (req, res) => {
    try {
        const tutor = await TutorService.getFeaturedTutors();
        res.status(200).json({
            success: true,
            data: tutor,
        });
    }
    catch (err) {
        res.status(404).json({
            success: false,
            message: err.message,
        });
    }
};
const getBookedSessions = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const sessions = await TutorService.getTutorBookedSessions(userId);
        res.status(200).json({
            success: true,
            data: sessions,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
export const TutorController = {
    upsertProfile,
    setAvailability,
    getTutors,
    getTutor,
    getFeaturedTutor,
    getBookedSessions
};
