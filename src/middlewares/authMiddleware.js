import JWT from "jsonwebtoken";
import { Config } from "../config/config.js";


export const verifyToken = (req, res, next) => {
    const { Access_Token } = req.cookies;

    if (!Access_Token) return res.status(401).json({
        message: "Token not provided",
        success: false
    });

    try {
        const decodedToken = JWT.verify(Access_Token, Config.JWT_SECRET);
    
        req.user = decodedToken.userId;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "User not authorised",
            success: false
        });
    }
};
