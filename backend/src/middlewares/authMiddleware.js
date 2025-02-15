function verificarGestor(req, res, next) {
    const usuario = req.usuario; // Asume que el usuario está en el request después de la autenticación
    if (usuario && usuario.rol === "Gestor de notas") {
        next(); // Permite continuar con la siguiente función (controlador)
    } else {
        res.status(403).json({ message: "Acceso denegado." }); // Deniega el acceso
    }
}

module.exports = { verificarGestor };