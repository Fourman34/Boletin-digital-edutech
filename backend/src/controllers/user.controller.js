const database = require('../config/database');
const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');  // Para encriptar las contraseñas
const { body, validationResult } = require('express-validator');  // Para validar datos

// Función para leer un usuario
const readUser = (req, res) => {
    const { id } = req.params;  // Se espera que el ID de usuario sea un parámetro en la URL

    const readQuery = `SELECT usuarios.*, roles.nombre_rol FROM usuarios 
                       JOIN roles ON usuarios.ID_rol = roles.ID_rol 
                       WHERE ID_usuario = ?;`;

    const query = mysql2.format(readQuery, [id]);

    database.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error en la consulta a la base de datos' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(result[0]); // Retorna el usuario encontrado con su rol
    });
};

// Función para crear un usuario
const createUser = [
    // Validaciones usando express-validator
    body('dni').notEmpty().isNumeric().withMessage('El DNI debe ser un número'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    body('email').isEmail().withMessage('El email no es válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('ID_rol').notEmpty().isNumeric().withMessage('El ID de rol es obligatorio y debe ser un número'),

    async (req, res) => {
        // Manejo de errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { dni, nombre, apellido, email, password, ID_rol } = req.body;

        // Hash de la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Verifica que el rol exista en la tabla de roles
        const checkRoleQuery = 'SELECT * FROM roles WHERE ID_rol = ?';
        database.query(checkRoleQuery, [ID_rol], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al verificar el rol' });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }

            // Si el rol existe, se procede a crear el usuario
            const createQuery = 'INSERT INTO usuarios (dni, nombre, apellido, email, contraseña, ID_rol) VALUES (?, ?, ?, ?, ?, ?)';
            database.query(createQuery, [dni, nombre, apellido, email, hashedPassword, ID_rol], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error al crear el usuario' });
                }

                res.status(201).json({ message: 'Usuario creado con éxito', ID_usuario: result.insertId });
            });
        });
    }
];

// Función para actualizar un usuario
// Función para actualizar un usuario
const updateUser = (req, res) => {
    const { id } = req.params;  // Actualizamos el usuario usando su ID
    const { dni, nombre, apellido, email, password, ID_rol } = req.body;

    const updateQuery = `
        UPDATE usuarios
        SET dni = ?, nombre = ?, apellido = ?, email = ?, contraseña = ?, ID_rol = ?
        WHERE ID_usuario = ?`;

    // Los valores que pasarán a la consulta SQL
    const values = [dni, nombre, apellido, email, password, ID_rol, id];

    database.query(updateQuery, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado con éxito' });
    });
};

// Función para eliminar un usuario
const deleteUser = (req, res) => {
    const { id } = req.params;  // Obtener el ID del usuario a eliminar

    const deleteQuery = 'DELETE FROM usuarios WHERE ID_usuario = ?';  // SQL para eliminar usuario

    const query = mysql2.format(deleteQuery, [id]);  // Formatear la consulta con el ID del usuario

    // Ejecutar la consulta
    database.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al eliminar el usuario' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    });
};




module.exports = {
    createUser,
    readUser,
    updateUser,
    deleteUser,
};
