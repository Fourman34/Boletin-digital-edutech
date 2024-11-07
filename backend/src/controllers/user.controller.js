const database = require('../config/database');
const mysql2 = require('mysql2');

// Función para leer un usuario
const readUser = (req, res) => {
    const { id } = req.params;  // Ahora, esperamos que el ID de usuario sea el parámetro

    const readQuery = `SELECT * FROM usuarios WHERE ID_usuario = ?;`;

    const query = mysql2.format(readQuery, [id]);

    database.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error en la consulta a la base de datos' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(result[0]); // Retorna el usuario encontrado como JSON
    });
};

// Función para crear un usuario
const createUser = (req, res) => {
    const { dni, nombre, apellido, email, password, ID_rol } = req.body;

    const createQuery = 'INSERT INTO User(dni, nombre, apellido, email, password, ID_rol ) VALUE (?, ?, ?, ?, ?, ?)'

    const query = mysql2.format(createQuery, [dni, nombre, apellido, email, password, ID_rol ])
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

        database.query(createQuery, [dni, nombre, apellido, email, password, ID_rol], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al crear el usuario' });
            }

            res.status(201).json({ message: 'Usuario creado con éxito', ID_usuario: result.insertId });
        });
    });
};

// Función para actualizar un usuario
const updateUser = (req, res) => {
    const { id } = req.params;  // Ahora, actualizamos el usuario usando su ID
    const { password, ID_rol } = req.body;

    const updateQuery = `
        UPDATE usuarios
        SET contraseña = ?, ID_rol = ?
        WHERE ID_usuario = ?
    `;

    database.query(updateQuery, [password, ID_rol, id], (err, result) => {
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
    const { id } = req.params;  // Eliminar el usuario por su ID

    const deleteQuery = 'DELETE FROM usuarios WHERE ID_usuario = ?';

    database.query(deleteQuery, [id], (err, result) => {
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
