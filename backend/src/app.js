const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/:name/:id', (req, res) => {
    const {name, id} = req.params;
    res.send(`${name}: ${id}`);  // Usar backticks para interpolación
});

app.post('/', (req, res) => {
    const {email, password} = req.body;
    res.send(`${email}: ${password}`);  // Corregir la sintaxis de res.send
});

app.put('/', (req, res) => {
    res.send('petición PUT');
});

app.delete('/', (req, res) => {
    res.send('petición DELETE');
});

app.listen(3000, () => {
    console.log('servidor encendido');
});
