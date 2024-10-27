// Requiere el paquete de MySQL
const mysql = require('mysql');

// Crear la conexión
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tpi:escobar123',
    database: 'colegio_guevara_boletin1'
});

// Establecer la conexión
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conexión establecida correctamente');
});

// Realizar la consulta
connection.query('SELECT * FROM notas', (err, rows) => {
    if (err) throw err;
    console.log('Los datos solicitados son:');
    console.log(rows);

    // Finalizar la conexión solo después de obtener los resultados
    connection.end((err) => {
        if (err) {
            console.error('Error cerrando la conexión:', err.stack);
            return;
        }
        console.log('Conexión cerrada correctamente');
    });
});
