import { Router } from "express";
import { createOrder, getOrder, getOrders, updateOrderStatus } from "../controllers/orderController";
import { verifyAccess } from "../middlewares/verifyAccess";

const router = Router();

router.get('/all', verifyAccess, getOrders)

router.get('/:id', verifyAccess, getOrder)

router.post('/create', verifyAccess, createOrder)

router.put('/:id/update-status', verifyAccess, updateOrderStatus)

export default router