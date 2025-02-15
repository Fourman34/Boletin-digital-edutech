const express = require("express");
const { verificarGestor } = require("../middlewares/authMiddleware");
const { obtenerNotas, guardarNotas } = require("../controllers/notas.controller");

const router = express.Router();

// Ruta para obtener notas
router.get("/obtener-notas", obtenerNotas);

// Ruta para guardar notas (protegida por el middleware verificarGestor)
router.post("/guardar-notas", verificarGestor, guardarNotas);

module.exports = router;