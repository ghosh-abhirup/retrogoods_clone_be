import { getUser, loginUser, logoutHandler, refreshAccessToken, registerUser, updateUser } from "../controllers/userController";
import { Router } from "express";
import { verifyAccess } from "../middlewares/verifyAccess";
const router = Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/refresh-access-token', refreshAccessToken);

router.put('/:id/edit', verifyAccess, updateUser)

router.get('/:id', verifyAccess, getUser)

router.post('/logout', verifyAccess, logoutHandler);

export default router;