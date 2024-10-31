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
    res.send(`${email}: ${password}`);
});

app.put('/', (req, res) => {
    res.send('Petición PUT');
});

app.delete('/', (req, res) => {
    res.send('Petición DELETE');
});

app.listen(3000, () => {
    console.log('Servidor encendido');
});
