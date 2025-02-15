const express = require("express");
const database = require("./config/database");
const { verificarGestor } = require("./notas/authMiddleware");

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta para obtener notas
app.get("/obtener-notas", async (req, res) => {
    const { materia } = req.query;

    try {
        const query = "SELECT * FROM notas WHERE materia = ?";
        const [notas] = await database.query(query, [materia]);
        res.status(200).json(notas);
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        res.status(500).json({ message: "Error al obtener las notas." });
    }
});

// Ruta para guardar notas
app.post("/guardar-notas", verificarGestor, async (req, res) => {
    const notas = req.body;

    try {
        // Iniciar una transacción
        await database.query("START TRANSACTION");

        for (const nota of notas) {
            const query = `
                INSERT INTO notas (
                    ID_usuario, materia, nota, fecha,
                    primer_cuatrimestre_1, primer_cuatrimestre_2, primer_cuatrimestre_nota,
                    segundo_cuatrimestre_1, segundo_cuatrimestre_2, segundo_cuatrimestre_nota,
                    nota_final, nota_diciembre, nota_febrero_marzo
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;

            const ID_usuario = await obtenerIdUsuarioPorNombre(nota.alumno);
            const fecha = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD

            await database.query(query, [
                ID_usuario,
                nota.materia,
                nota.nota || null, // Si no se proporciona, se guarda como NULL
                fecha,
                nota.primer_cuatrimestre_1,
                nota.primer_cuatrimestre_2,
                nota.primer_cuatrimestre_nota,
                nota.segundo_cuatrimestre_1,
                nota.segundo_cuatrimestre_2,
                nota.segundo_cuatrimestre_nota,
                nota.nota_final,
                nota.nota_diciembre,
                nota.nota_febrero_marzo,
            ]);
        }

        // Confirmar la transacción
        await database.query("COMMIT");

        res.status(200).json({ message: "Notas guardadas correctamente." });
    } catch (error) {
        // Revertir la transacción en caso de error
        await database.query("ROLLBACK");
        console.error("Error al guardar las notas:", error);
        res.status(500).json({ message: "Error al guardar las notas." });
    }
});

// Función para obtener el ID_usuario por nombre
async function obtenerIdUsuarioPorNombre(nombre) {
    const query = "SELECT ID_usuario FROM usuarios WHERE nombre = ?";
    const [result] = await database.query(query, [nombre]);
    return result.length > 0 ? result[0].ID_usuario : null;
}

// Iniciar el servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});