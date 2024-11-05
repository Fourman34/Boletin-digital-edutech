const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: '127.0.0.207',
    user: 'root',
    password: 'tpi:escobar123',
    database: 'colegio_guevara_boletin1'
});

module.exports = connection;
