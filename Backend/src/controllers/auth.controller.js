import { pool } from "../databases/db.mysql.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import config from "../libs/config.js";

// Ruta para iniciar sesión (Login)
export const login = async (req, res) => {

    // Manejar errores de validación con express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        // Comparar contraseñas
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                return res.status(500).json({ error: 'Error comparing passwords' });
            }
            if (!match) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Crear JWT con rol
            const token = jwt.sign({ id: user.id, email: user.email, role: user.role, is_super_admin: user.is_super_admin }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
            console.log(token);
            return res.status(200).json({ message: 'Login successful', token });
        });
    } catch (error) {
        console.error('Error executing query:', error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error al logearse el usuario' });
        }
    }
};


// Ruta para crear usuario (Signup)
export const signup = async (req, res) => {

    // Manejar errores de validación con express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role = 'user', is_super_admin = false } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El usuario ya está registrado' });
        }

        // Registrar nuevo usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role, is_super_admin) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, role, is_super_admin]
        );

        // Crear JWT
        const token = jwt.sign({ id: result.id, email, role, is_super_admin }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
        console.log(token);
        res.status(201).json({ message: 'Usuario registrado exitosamente', token });
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error al registrar el usuario' });
        }
    }
};


