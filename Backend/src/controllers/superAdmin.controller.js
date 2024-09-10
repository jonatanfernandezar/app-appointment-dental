import { pool } from "../databases/db.mysql.js";
import bcrypt from 'bcrypt';

// Crear un nuevo administrador
export const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    const role = 'admin';

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El usuario ya está registrado.' });
        }

        // Hashear la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo administrador
        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        res.status(201).json({ message: 'Administrador creado exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el administrador.', error: error.message });
    }
};

// Borrar un administrador o usuario
export const deleteAdminUser = async (req, res) => {
    const userIdToDelete = req.params.id;
    const loggedInUserId = req.user.id;

    // Verificar si el super admin intenta borrarse a sí mismo
    if (userIdToDelete === loggedInUserId.toString()) {
        return res.status(403).json({ message: 'No puedes eliminar tu propia cuenta de super admin.' });
    }

    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ? AND is_super_admin = 0', [userIdToDelete]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Administrador no encontrado o es el super admin.' });
        }

        res.status(200).json({ message: 'Administrador/Usuario eliminado exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el administrador.', error: error.message });
    }
};

// Controlador para asignar el rol de "profesional" a un usuario
export const assignRoleMedico = async (req, res) => {
    const userID = req.params.id;
    const { role } = req.body;

    // Validar que solo se puedan asignar roles permitidos
    const validRoles = ['profesional'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Rol no válido. Solo se puede asignar el rol de "profesional".' });
    }

    try {
        // Actualizar el rol del usuario en la base de datos
        const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userID]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: `Rol de usuario actualizado a ${role}.` });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol del usuario.', error: error.message });
    }
};

// Para obtener todos los usuarios.
export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM  users');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
};

// Para obtener un único usuario.
export const getUser = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM  users WHERE id = ?', [req.params.id]);

        // Si no encuentra el empleado...
        if (rows.length <= 0) return res.status(404).json({
            message: 'User not found'
        })
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
};
