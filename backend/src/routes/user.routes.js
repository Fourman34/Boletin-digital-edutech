const { Router } = require('express');
const { 
    createUser, 
    readUser, 
    updateUser, 
    deleteUser, 
    loginUser, 
    getAllUsers // Nueva función para obtener todos los usuarios
} = require('../controllers/user.controller.js');
const router = Router();

// Rutas para manejar usuarios
router.get('/', getAllUsers); // Obtener todos los usuarios
router.get('/:id', readUser); // Obtener un usuario por ID
router.post('/', createUser); // Crear un usuario
router.put('/:id', updateUser); // Actualizar un usuario
router.delete('/:id', deleteUser); // Eliminar un usuario

// Ruta para el inicio de sesión
router.post('/login', loginUser);

module.exports = router;