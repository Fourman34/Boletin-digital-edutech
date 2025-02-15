// middlewares/authMiddleware.js
function verificarGestor(req, res, next) {
    const usuario = req.usuario; // Asume que el usuario está en el request después de la autenticación
    if (usuario && usuario.rol === "Gestor de notas") {
        next();
    } else {
        res.status(403).json({ message: "Acceso denegado." });
    }
}

module.exports = { verificarGestor };
