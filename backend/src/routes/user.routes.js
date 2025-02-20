const { Router } = require('express');
const { createUser, readUser, updateUser, deleteUser, loginUser } = require('../controllers/user.controller.js');
const router = Router();

// Rutas para manejar usuarios
router.get('/:id', readUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Ruta para el inicio de sesión
router.post('/login', loginUser); // Agrega esta línea

module.exports = router;