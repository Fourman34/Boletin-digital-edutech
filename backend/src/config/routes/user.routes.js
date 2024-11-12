
const { Router } = require('express');
const { createUser, readUser, updateUser, deleteUser } = require('../../controllers/user.controller'); // Ajusta la ruta
const router = Router();

// Define las rutas
router.get('/:id', readUser);

router.post('/',createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

// Exportar el enrutador
module.exports = router;
