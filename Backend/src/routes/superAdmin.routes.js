import express from 'express';
import { createAdmin, deleteAdminUser, assignRoleMedico, getUsers, getUser } from '../controllers/superAdmin.controller.js';
import { verifySuperAdmin, verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/users', verifyToken, verifySuperAdmin, getUsers);
router.get('/users/:id', verifyToken, verifySuperAdmin, getUser);
router.post('/create-admin', verifyToken, verifySuperAdmin, createAdmin);
router.patch('/users/:id', verifyToken, verifySuperAdmin, assignRoleMedico);
router.delete('/users/:id', verifyToken, verifySuperAdmin, deleteAdminUser);

export default router;