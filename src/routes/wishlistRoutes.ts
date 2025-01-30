import { Router } from "express";
import { verifyAccess } from "../middlewares/verifyAccess";
import { addToWishlist, getWishlists, removeFromWishlist } from "../controllers/wishlistController";

const router = Router();

router.get('/all', verifyAccess, getWishlists);

router.post('/add', verifyAccess, addToWishlist);

router.delete('/:id/remove', verifyAccess, removeFromWishlist)

export default router