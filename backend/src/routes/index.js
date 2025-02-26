const express = require("express");
const database = require("./config/database");
const notasRoutes = require("./routes/notas.routes"); // Importar las rutas de notas

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de notas
app.use("/", notasRoutes);

// Manejo de errores 404 (Ruta no encontrada)
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Error en el servidor" });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});