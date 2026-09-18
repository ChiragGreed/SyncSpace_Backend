import JWT from 'jsonwebtoken';
import { Config } from '../config/config.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const generateToken = (userId) => {
    return JWT.sign(
        { userId },
        Config.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

/**
 * @route POST /api/auth/register
 * Register a new user, issue an access token, and return the created user.
 */
export const register = async (req, res, next) => {
    try {
        const { fullName, email, role, password } = req.body;

        const isAlreadyUser = await userModel.findOne({ email: email });

        if (isAlreadyUser) return res.status(400).json({
            message: "User already exists",
            success: false
        })

        const user = await userModel.create({ fullName, email: email.toLowerCase(), role, password });

        const token = generateToken(user._id);

        res.cookie('Access_Token', token);

        res.status(201).json({
            message: "User registered successfully",
            success: true,
            user
        });
    } catch (err) {
        next(err);
    }
}

/**
 * @route POST /api/auth/login
 * Authenticate a user with email and password, then issue an access token.
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) return res.status(404).json({
            message: "Invalid creditentials",
            success: false
        })

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(400).json({
            message: "Invalid creditentials",
            success: false
        })

        const token = generateToken(user._id);

        res.cookie('Access_Token', token);

        res.status(200).json({
            message: "User logged in successfully",
            success: true,
            user
        });
    } catch (err) {
        next(err);
    }
}

/**
 * @route GET /api/auth/
 * Return the authenticated user's profile using the ID set by auth middleware.
 */
export const getMe = async (req, res, next) => {
    try {

        const userId = req.user;

        const user = await userModel.findOne({ _id: userId });

        if (!user) return res.status(404).json({
            message: `No user found with id ${userId}`,
            success: false
        })

        res.status(200).json({
            message: "User fetched successfully",
            success: true,
            user
        });
    } catch (err) {
        next(err);
    }
}