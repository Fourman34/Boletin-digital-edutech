const express = require('express');
const userRoutes = require('./routes/user.routes');  // Ruta a las rutas de usuarios
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/user', userRoutes);  // Ruta para manejar usuarios

module.exports = app;
