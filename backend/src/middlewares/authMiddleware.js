const jwt = require("jsonwebtoken");

function verificarGestor(req, res, next) {
    // Obtener el token del encabezado de la solicitud
    const token = req.header("Authorization");

    // Verificar si el token está presente
    if (!token) {
        console.log("Token no proporcionado"); // Log para depuración
        return res.status(401).json({ message: "No autorizado: token no proporcionado." });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token.replace("Bearer ", ""), "tu_secreto"); // Reemplaza "tu_secreto" con tu clave secreta
        req.usuario = decoded; // Asignar el usuario decodificado a req.usuario

        // Verificar si el usuario tiene el rol correcto
        if (req.usuario.rol === "Gestor de notas" || req.usuario.rol === "Administrador") {
            console.log("Usuario autorizado:", req.usuario); // Log para depuración
            next(); // Permite continuar con la siguiente función (controlador)
        } else {
            console.log("Usuario no autorizado:", req.usuario); // Log para depuración
            res.status(403).json({ message: "Acceso denegado: no tienes permisos suficientes." }); // Deniega el acceso
        }
    } catch (error) {
        console.error("Error al verificar el token:", error); // Log para depuración
        res.status(401).json({ message: "No autorizado: token inválido o expirado." });
    }
}

module.exports = { verificarGestor };