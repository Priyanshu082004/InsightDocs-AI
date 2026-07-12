import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import documentRoutes from "../modules/document/document.routes.js";
 


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/documents", documentRoutes);

export default router;