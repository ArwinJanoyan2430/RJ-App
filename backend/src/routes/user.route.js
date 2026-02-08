import {Router} from "express";
import { addAddresses } from "../controllers/user.controller.js";
import { getAddresses } from "../controllers/user.controller.js";
import { updateAddresses } from "../controllers/user.controller.js";
import { deleteAddresses } from "../controllers/user.controller.js";

const router = Router();
router.use(protectRoute);

// Address routes
router.post("/addresses", addAddresses);
router.get("/addresses", getAddresses);
router.put("/addresses/: addressId", updateAddresses);
router.delete("/addresses/: addressId", deleteAddresses);

//wishlist routes
router.post("/wishlist", addToWishlist);
router.delete("/wishlist/: productId", removeFromWishlist);
router.get("/wishlist", getWishlist);

export default router;