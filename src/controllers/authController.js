import { users } from '../mockData.js';
import JWT from 'jsonwebtoken';
import { Config } from '../config.js';
import crypto from 'crypto';
import { sanitizeUser } from '../utils/sanitizeUser.js';

const generateToken = (userId) => {
    return JWT.sign(
        { userId },
        Config.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

export const register = (req, res, next) => {
    try {
        const { fullName, email, role, password } = req.body;

        const isAlreadyUser = users.find(user => user.email === email);

        if (isAlreadyUser) return res.status(400).json({
            message: "User already exists",
            success: false
        })

        const userId = crypto.randomUUID();

        const newUser = { userId, fullName, email, role, password };
        users.push(newUser);

        const token = generateToken(userId);

        res.cookie('Access_Token', token);

        res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: sanitizeUser(newUser)
        });
    } catch (err) {
        next(err);
    }
}

export const login = (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = users.find(user => user.email === email);

        if (!user) return res.status(404).json({
            message: "User do not exist from the given email",
            success: false
        })

        const isPasswordCorrect = user.password === password;

        if (!isPasswordCorrect) return res.status(400).json({
            message: "Password is incorrect",
            success: false
        })

        const token = generateToken(user.userId);

        res.cookie('Access_Token', token);

        res.status(200).json({
            message: "User logged in successfully",
            success: true,
            user: sanitizeUser(user)
        });
    } catch (err) {
        next(err);
    }
}

export const getMe = (req, res, next) => {
    try {

        const userId = req.user;

        const user = users.find(user => user.userId === userId);

        if (!user) return res.status(404).json({
            message: `No user found with id ${userId}`,
            success: false
        })

        res.status(200).json({
            message: "User fetched successfully",
            success: true,
            user: sanitizeUser(user)
        });
    } catch (err) {
        next(err);
    }
}