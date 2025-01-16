import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/token.verify"; 
import User from "../../user/user.schema"; 
import jwt, { JwtPayload } from "jsonwebtoken";
;
export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ success: false, message: "Authorization token is missing" });
      }
  
      const jwtSecretKey = process.env.JWT_SECRET;
      if (!jwtSecretKey) {
        throw new Error("JWT secret key is not defined in the environment variables");
      }
  
      
      const decodedToken = jwt.verify(token, jwtSecretKey);
  
      
      if (typeof decodedToken === "object" && "userId" in decodedToken) {
        const { userId, email } = decodedToken as JwtPayload;
  
       
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
  
       
        if (user.email !== email) {
          return res.status(403).json({ success: false, message: "Email in token does not match user email" });
        }
  
       
        // Proceed to the next middleware or route handler
        return next();
      }
  
      return res.status(401).json({ success: false, message: "Invalid token structure" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };