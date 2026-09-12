import { config } from 'dotenv'
config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT Secret not found in environment variables.")
}

export const Config = {
    JWT_SECRET: process.env.JWT_SECRET
}