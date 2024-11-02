const express = require('express');
const mysql2 = require('mysql2');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP routes
app.get('/:name/:id', (req, res) => {
    const { name, id } = req.params;
    res.send(`${name}: ${id}`);
});

app.post('/', (req, res) => {
    const { email, password } = req.body;
    res.send(`${gmail}: ${password}`);
});

app.put('/', (req, res) => {
    res.send('Petición PUT');
});

app.delete('/', (req, res) => {
    res.send('Petición DELETE');
});

// DB Routes
    const connection = mysql2.createConnection({
        host: '127.0.0.207', // Falta la coma
        user: 'root',
        password: 'tpi:escobar123',
        database: 'colegio_guevara_boletin1'
    });
    
connection.connect((err)=>{

if (err) throw err
console.log('BD conectada')
})

const querySQL = 'SHOW TABLES'

connection.query(querySQL, )

app.listen(3000, () => {
    console.log('Servidor encendido');
});
