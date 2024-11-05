const express = require('express');
const userRoutes = require('./routes/user.routes'); 
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints
app.use('/user', userRoutes); // Vincula el enrutador aquí

module.exports = app;
