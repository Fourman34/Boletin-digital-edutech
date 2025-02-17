require('dotenv').config({ path: '../.env' }); // Cargar las variables de entorno desde el archivo .env
const mysql = require('mysql2/promise'); // Usar la versión con soporte de promesas

// Crear un pool de conexiones usando las variables de entorno
const pool = mysql.createPool({
    host: process.env.DB_HOST,       // Usar la variable de entorno DB_HOST
    user: process.env.DB_USER,       // Usar la variable de entorno DB_USER
    password: process.env.DB_PASSWORD, // Usar la variable de entorno DB_PASSWORD
    database: process.env.DB_NAME,   // Usar la variable de entorno DB_NAME
    waitForConnections: true,        // Esperar a que haya conexiones disponibles
    connectionLimit: 10,             // Límite máximo de conexiones en el pool
    queueLimit: 0                    // Sin límite en la cola de espera
});

// Verificar la conexión al pool
pool.getConnection()
    .then((connection) => {
        console.log('Conexión a la base de datos exitosa');
        connection.release(); // Liberar la conexión de vuelta al pool
    })
    .catch((err) => {
        console.error('Error al conectar a la base de datos:', err);
    });

// Exportar el pool para su uso en otros archivos
module.exports = pool;