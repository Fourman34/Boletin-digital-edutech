const database = require('../config/database');
const { body, validationResult } = require('express-validator');

// Función para leer un usuario
const readUser = (req, res) => {
    const { id } = req.params;

    const readQuery = `
        SELECT usuarios.*, roles.nombre_rol 
        FROM usuarios 
        JOIN roles ON usuarios.ID_rol = roles.ID_rol 
        WHERE ID_usuario = ?;
    `;

    database.query(readQuery, [id], (err, result) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).json({ message: 'Error al obtener el usuario. Por favor, inténtalo de nuevo.' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json(result[0]);
    });
};

// Función para crear un usuario
const createUser = [
    // Validaciones usando express-validator
    body('dni').notEmpty().isNumeric().withMessage('El DNI debe ser un número.'),
    body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
    body('apellido').notEmpty().withMessage('El apellido es obligatorio.'),
    body('email').isEmail().withMessage('El email no es válido.'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('ID_rol').notEmpty().isNumeric().withMessage('El ID de rol es obligatorio y debe ser un número.'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { dni, nombre, apellido, email, password, ID_rol } = req.body;

        // Verifica que el rol exista en la tabla de roles
        const checkRoleQuery = 'SELECT * FROM roles WHERE ID_rol = ?';
        database.query(checkRoleQuery, [ID_rol], (err, result) => {
            if (err) {
                console.error('Error al verificar el rol:', err);
                return res.status(500).json({ message: 'Error al verificar el rol. Por favor, inténtalo de nuevo.' });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Rol no encontrado.' });
            }

            // Si el rol existe, se procede a crear el usuario
            const createQuery = `
                INSERT INTO usuarios (dni, nombre, apellido, email, contraseña, ID_rol) 
                VALUES (?, ?, ?, ?, ?, ?);
            `;

            database.query(createQuery, [dni, nombre, apellido, email, password, ID_rol], (err, result) => {
                if (err) {
                    console.error('Error al crear el usuario:', err);
                    return res.status(500).json({ message: 'Error al crear el usuario. Por favor, inténtalo de nuevo.' });
                }

                res.status(201).json({ 
                    message: 'Usuario creado con éxito.', 
                    ID_usuario: result.insertId 
                });
            });
        });
    }
];

// Función para actualizar un usuario
const updateUser = (req, res) => {
    const { id } = req.params;
    const { dni, nombre, apellido, email, password, ID_rol } = req.body;

    const updateQuery = `
        UPDATE usuarios
        SET dni = ?, nombre = ?, apellido = ?, email = ?, contraseña = ?, ID_rol = ?
        WHERE ID_usuario = ?;
    `;

    database.query(updateQuery, [dni, nombre, apellido, email, password, ID_rol, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            return res.status(500).json({ message: 'Error al actualizar el usuario. Por favor, inténtalo de nuevo.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Usuario actualizado con éxito.' });
    });
};

// Función para eliminar un usuario
const deleteUser = (req, res) => {
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM usuarios WHERE ID_usuario = ?;';

    database.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            return res.status(500).json({ message: 'Error al eliminar el usuario. Por favor, inténtalo de nuevo.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Usuario eliminado con éxito.' });
    });
};

// Función para iniciar sesión
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = `
            SELECT usuarios.*, roles.nombre_rol 
            FROM usuarios 
            JOIN roles ON usuarios.ID_rol = roles.ID_rol 
            WHERE email = ?;
        `;

        database.query(query, [email], (err, result) => {
            if (err) {
                console.error('Error en la consulta a la base de datos:', err);
                return res.status(500).json({ message: 'Error al iniciar sesión. Por favor, inténtalo de nuevo.' });
            }

            if (result.length === 0) {
                return res.status(400).json({ message: 'Correo electrónico no registrado.' });
            }

            const user = result[0];

            // Compara las contraseñas en texto plano
            if (password !== user.contraseña) {
                return res.status(400).json({ message: 'Contraseña incorrecta.' });
            }

            res.status(200).json({ 
                success: true,
                message: 'Inicio de sesión exitoso.', 
                user: {
                    ID_usuario: user.ID_usuario,
                    dni: user.dni,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email,
                    rol: user.nombre_rol
                }
            });
        });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el servidor. Por favor, inténtalo de nuevo.' });
    }
};

// Exporta todas las funciones
module.exports = {
    createUser,
    readUser,
    updateUser,
    deleteUser,
    loginUser,
};