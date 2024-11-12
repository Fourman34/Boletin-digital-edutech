const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: '127.0.0.207',  // Verifica que esta IP sea correcta, si no usa 'localhost'
    user: 'root',
    password: 'tpi:escobar123',  // Asegúrate que sea la contraseña correcta
    database: 'colegio_guevara_boletin1'
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
