import { Router } from "express";
import { getSpecificProduct, addProduct, updateProduct, getProducts } from "../controllers/productController";
import { verifyAccess } from "../middlewares/verifyAccess";

const router = Router();

router.get('/products', verifyAccess, getProducts)

router.get('/:id', verifyAccess, getSpecificProduct)

router.post('/add', verifyAccess, addProduct)

router.put(`/:id/update`, verifyAccess, updateProduct)

export default router;