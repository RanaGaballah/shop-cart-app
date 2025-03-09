import { Router } from "express";
import authController from "../controllers/authController"; // Ensure correct path

const router = Router();

router.post("/login", (req, res) => authController.login(req, res) as unknown as void);
router.post("/signUp", (req, res) => authController.signUp(req, res) as unknown as void);

export default router;



