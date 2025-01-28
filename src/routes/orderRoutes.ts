import { Router } from "express";
import { createOrder, getOrder, updateOrderStatus } from "../controllers/orderController";
import { verifyAccess } from "../middlewares/verifyAccess";

const router = Router();

router.get('/orders')

router.get('/:id', verifyAccess, getOrder)

router.post('/create-order', verifyAccess, createOrder)

router.put('/:id/update-order-status', verifyAccess, updateOrderStatus)

export default router