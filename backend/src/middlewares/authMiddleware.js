function verificarGestor(req, res, next) {
    const usuario = req.usuario; // Asume que el usuario está en el request después de la autenticación

    // Verificar si el usuario está autenticado
    if (!usuario) {
        return res.status(401).json({ message: "No autorizado: usuario no autenticado." });
    }

    // Verificar si el usuario tiene el rol correcto
    if (usuario.rol === "Gestor de notas" || usuario.rol === "Administrador") {
        next(); // Permite continuar con la siguiente función (controlador)
    } else {
        res.status(403).json({ message: "Acceso denegado: no tienes permisos suficientes." }); // Deniega el acceso
    }
}

module.exports = { verificarGestor };