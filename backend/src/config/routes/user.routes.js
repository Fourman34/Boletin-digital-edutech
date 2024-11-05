// src/config/routes/user.routes.js
const { Router } = require('express');
const { createUser, readUser, updateUser, deleteUser } = require('../../controllers/user.controller'); // Ajusta la ruta
const router = Router();

// Define las rutas
router.get('/:name/:id', createUser);

router.post('/', (req, res) => {
    const { email, password } = req.body;
    res.send(`${email}: ${password}`);
});

router.put('/', (req, res) => {
    res.send('Petición PUT');
});

router.delete('/', (req, res) => {
    res.send('Petición DELETE');
});

// Exportar el enrutador
module.exports = router;
