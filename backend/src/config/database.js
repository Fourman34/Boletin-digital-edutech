require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env
const mysql2 = require('mysql2');

// Crear la conexión usando las variables de entorno
const connection = mysql2.createConnection({
    host: process.env.DB_HOST,       // Usar la variable de entorno DB_HOST
    user: process.env.DB_USER,       // Usar la variable de entorno DB_USER
    password: process.env.DB_PASSWORD, // Usar la variable de entorno DB_PASSWORD
    database: process.env.DB_NAME    // Usar la variable de entorno DB_NAME
});

// Agregar manejo de errores detallado
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

module.exports = connection;
