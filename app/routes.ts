import express from "express";

// import adminRoutes from "../app/common/admin/admin.routes"
import userRoutes from "./user/user.route"
import eventRoutes from "./events/event.route"
const router = express.Router();

// router.use("/users", userRoutes);
// router.use("/admin",adminRoutes)
router.use("/users",userRoutes)
router.use("/events",eventRoutes)

export default router;