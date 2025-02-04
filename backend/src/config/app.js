const express = require('express');
const userRoutes = require('./routes/user.routes.js');  // Ruta a las rutas de usuarios
const app = express();

app.set('port', 3000);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/user', userRoutes);  // Ruta para manejar usuarios

module.exports = app;

const path = require('path'); // Importar path

app.use(express.static(path.join(__dirname, '../../../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('C:/Users/lauta/OneDrive/Escritorio/TPI/pagina web/boletin digital Edutech/frontend/index1.html'));
});

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`servidor corriendo en http://localhost:${app.get('port')}`);  // Usa backticks para interpolar la variable
});
