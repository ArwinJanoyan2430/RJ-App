import {Router} from "express";
import { createProduct, getAllProducts, updateProduct} from "../controllers/admin.controller.js";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js";
import { get } from "mongoose";
import { getAllOrders, updateOrderStatus, getAllCustomers, getDashboardStats} from "../controllers/admin.controller.js";

const router = Router();
//optimization-dry
router.use(protectRoute, adminOnly);

router.post("/products", upload.array("images", 3),createProduct);
router.get("/products",  getAllProducts);
router.put("/products/:id", updateProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

router.get("/customers", getAllCustomers);
router.get("/stats", getDashboardStats);

export default router;