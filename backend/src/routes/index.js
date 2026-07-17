import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import documentRoutes from "../modules/document/document.routes.js";
import chatRoutes from "../modules/chat/chat.routes.js";
import notificationRoutes from "../modules/notification/notification.routes.js";
import auditRoutes from "../modules/audit/audit.routes.js"


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/documents", documentRoutes);
router.use("/chat", chatRoutes);
router.use("/notifications",notificationRoutes)
router.use("/audit-logs",auditRoutes)



export default router;