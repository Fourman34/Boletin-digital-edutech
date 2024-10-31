const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send ('hola mundo')
});

app.post ('/', (req, res)=> {
    res.send('peticion POST');
});

app.listen(3000, ()=>{
    console.log('servidor encendido');
});