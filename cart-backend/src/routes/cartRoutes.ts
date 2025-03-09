import { Router } from "express";
import CartController from "../controllers/CartController";
import verifyToken from "../middlewares/authMiddleware"; // Ensure correct path

const router = Router();

router.get("/getItems",verifyToken, (req, res) => CartController.getCartItems(req, res) as unknown as void);
router.delete("/deletecart",verifyToken, (req, res) => CartController.deleteCart(req, res) as unknown as void);
router.post("/addItems",verifyToken, (req, res) => CartController.addToCart(req, res) as unknown as void);

export default router;
