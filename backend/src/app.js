
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

//const querySQL = 'SHOW TABLES'

//connection.query(querySQL, (err, res) => { 
//    if (err) throw err;
//    console.log('Respuesta SQL', res);
//});
// DB Routes

connection.connect((err) => {
    if (err) throw err;
    console.log('BD conectada');
});

const checkQUERY = `SELECT * FROM usuario WHERE dni = 12345678`;

connection.query(checkQUERY, (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
        console.log('El usuario ya existe:', results);
        // Aquí puedes hacer una actualización si quieres
        // const updateQUERY = `UPDATE usuario SET contraseña = 'nuevaContraseña' WHERE dni = 12345678`;
    } else {
        const inserQUERY = `INSERT INTO usuario (dni, contraseña) VALUES (12345678, 'miContraseña');`;

        connection.query(inserQUERY, (err, res) => {
            if (err) throw err;
            console.log('Usuario insertado:', res);
        });
    }

    // Define getQUERY aquí si quieres obtener la lista de usuarios después de la inserción
    const getQUERY = 'SELECT * FROM usuario';

    connection.query(getQUERY, (err, res) => {
        if (err) throw err;
        console.log('Respuesta select:', res);
    });
});

app.listen(3000, () => {
    console.log('Servidor encendido');
});

