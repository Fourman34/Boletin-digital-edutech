const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tpi:escobar123',
    database: 'colegio_guevara_boletin1'
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conexión establecida correctamente');
});

connection.query('SELECT * FROM notas', (err, rows) => {
    if (err) throw err;
    console.log('Los datos solicitados son:');
    console.log(rows);

    connection.end((err) => {
        if (err) {
            console.error('Error cerrando la conexión:', err.stack);
            return;
        }
        console.log('Conexión cerrada correctamente');
    });
});
