const express = require('express');
const path = require('path');

// Importa las rutas de usuarios
const userRoutes = require('../routes/user.routes.js');  // Ruta corregida

const app = express();

app.set('port', 3000);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/user', userRoutes);  // Ruta para manejar usuarios

// Servir archivos estáticos (frontend)
const frontendPath = path.join(__dirname, '../../../frontend');
app.use(express.static(frontendPath));

// Ruta principal para servir el archivo HTML
app.get('/', (req, res) => {
    const indexPath = path.join(frontendPath, 'index1.html');
    res.sendFile(indexPath);
});

// Manejo de errores 404 (Ruta no encontrada)
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error en el servidor' });
});

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});