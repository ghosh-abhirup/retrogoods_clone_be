import { Router } from "express";
import { verifyAccess } from "../middlewares/verifyAccess";
import { addProduct, getAdminProducts, getProduct, updateProductByAdmin } from "../controllers/adminProductController";

const router = Router();

router.get('/products', verifyAccess, getAdminProducts);

router.get(':/id', verifyAccess, getProduct);

router.post('/add', verifyAccess, addProduct)

router.put('/:id', verifyAccess, updateProductByAdmin);

export default router;