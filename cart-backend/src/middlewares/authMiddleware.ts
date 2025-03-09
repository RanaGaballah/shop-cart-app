import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Define a custom interface to extend Express Request
interface CustomRequest extends Request {
  user?: { id: number; username: string }; // Define user type
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    // Verify token and extract user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; username: string };

    // Attach extracted user ID to request object
    req.user = decoded;

    // Log extracted user ID
    console.log("Authenticated User ID:", req.user.id);

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
  }
};

export default verifyToken;
