require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env

const express = require('express');
const userRoutes = require('./routes/user.routes');
const app = express();  // Definir la instancia de la aplicación

app.set('port', process.env.PORT || 3000);  // Usa la variable de entorno PORT o el valor predeterminado 3000

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
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});

module.exports = app;  // Exportar la instancia de la app
