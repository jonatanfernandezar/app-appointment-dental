import express from 'express';
import { assignRoleMedico, getUsers, getUser, deleteUser } from '../controllers/admin.controller.js';
import { verifyAdmin, verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/users', verifyToken, verifyAdmin, getUsers);
router.get('/users/:id', verifyToken, verifyAdmin, getUser);
router.patch('/users/:id', verifyToken, verifyAdmin, assignRoleMedico);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser);

export default router;
