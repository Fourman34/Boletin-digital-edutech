const jwt = require("jsonwebtoken");

function login(req, res) {
    const { email, password } = req.body;

    // Verificar credenciales (esto es un ejemplo, debes implementar la lógica real)
    const usuario = verificarCredenciales(email, password);

    if (!usuario) {
        return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // Generar un token JWT
    const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol }, // Datos del usuario
        "tu_secreto", // Clave secreta
        { expiresIn: "1h" } // Tiempo de expiración
    );

    res.json({ token });
}

module.exports = { login };