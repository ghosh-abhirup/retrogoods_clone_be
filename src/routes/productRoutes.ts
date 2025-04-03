import { Router } from "express";
import { getSpecificProduct, updateProduct, getProducts } from "../controllers/productController";
import { verifyAccess } from "../middlewares/verifyAccess";

const router = Router();

router.get('/', verifyAccess, getProducts)

router.get('/:id', verifyAccess, getSpecificProduct)

router.put(`/:id/update`, verifyAccess, updateProduct)

export default router;