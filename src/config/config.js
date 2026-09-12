import { config } from 'dotenv'
config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT Secret not found in the environment variables.")
}

if(!process.env.MONGO_URI){
    throw new Error("MONGO URI not found in the environment variables.")
}

export const Config = {
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI
}