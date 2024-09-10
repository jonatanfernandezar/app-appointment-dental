import express from 'express';
import { login, signup } from '../controllers/auth.controller.js';
import { body, validationResult } from 'express-validator'; // validar y sanitizar entradas del usuario.
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas para autenticación con express-validator
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Debe proporcionar un correo electrónico válido'),
        body('password').notEmpty().withMessage('La contraseña es requerida')
    ],
    login
);

router.post(
    '/signup',
    [
        body('name').notEmpty().withMessage('El nombre es requerido'),
        body('email').isEmail().withMessage('Debe proporcionar un correo electrónico válido'),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    ],
    signup
);

export default router;
