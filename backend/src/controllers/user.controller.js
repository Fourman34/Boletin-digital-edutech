// src/controllers/user.controller.js
const createUser = (req, res) => {
    const { name, id } = req.params; // Esto debería coincidir con tus rutas

    console.log('Desde el controlador');

    res.send(`${name}: ${id}`);
};

const readUser = (req, res) => {};

const updateUser = (req, res) => {};

const deleteUser = (req, res) => {};


module.exports = {
    createUser,
    readUser,
    updateUser,
    deleteUser,
};
