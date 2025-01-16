import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = (token: string) => {
    const jwtSecretKey = process.env.JWT_SECRET;

    if (!jwtSecretKey) {
        throw new Error("JWT secret is not defined in the environment variables");
    }
    try {
        
        const decoded = jwt.verify(token, jwtSecretKey);
        return decoded;  // Returns the decoded token
    } catch (error) {
        console.error('Invalid token:', error);
        return null;  // Token is invalid or expired
    }
};