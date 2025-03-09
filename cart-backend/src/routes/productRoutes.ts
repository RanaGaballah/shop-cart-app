import { Router } from "express";
import ProductController from "../controllers/ProductController"; // Ensure correct path
import verifyToken from "../middlewares/authMiddleware"; // Ensure correct path

const router = Router();


router.get("/", verifyToken, (req, res) => ProductController.getAllProducts(req, res) as unknown as void);
router.get("/:id",verifyToken, (req, res) => ProductController.getProductById(req, res) as unknown as void);
router.post("/add", verifyToken,(req, res) => ProductController.addProduct(req, res) as unknown as void);
router.delete("/delete/:id",verifyToken, (req, res) => ProductController.deleteProduct(req, res) as unknown as void);


export default router;