require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env

const express = require('express');
const userRoutes = require('./routes/user.routes');
const app = express();  // Definir la instancia de la aplicación

// Definir el puerto
const PORT = process.env.PORT || 3000; // Usar el puerto de la variable de entorno o 3000 por defecto

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Rutas
app.use('/user', userRoutes);  // Ruta para manejar usuarios

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;  // Exportar la instancia de la app