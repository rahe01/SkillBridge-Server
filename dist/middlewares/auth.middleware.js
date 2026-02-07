import jwt from "jsonwebtoken";
import config from "../config";
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        // Type-safe verification
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded; // attach user to request
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
