const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "No autorizado: token no proporcionado." });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, "tu_secreto"); // Cambia "tu_secreto" por tu clave secreta
        req.usuario = decoded; // Asignar el usuario decodificado a req.usuario
        next(); // Continuar con el siguiente middleware o ruta
    } catch (error) {
        return res.status(401).json({ message: "No autorizado: token inválido." });
    }
}

module.exports = { autenticar };