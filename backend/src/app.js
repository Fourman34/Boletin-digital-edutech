const express = require('express');

const app = express();

app.get('/', (req, res) =>{
    response.send ('hola mundo')
});

app.listen(3000, ()=>{
    console.log('servidor encendido');
});