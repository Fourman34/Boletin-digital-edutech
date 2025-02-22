const database = require("../config/database");

// Función para obtener materias
const obtenerMaterias = async (req, res) => {
    const { curso } = req.query;

    try {
        let query = "SELECT * FROM materias";
        const params = [];

        if (curso) {
            query += " WHERE curso = ?";
            params.push(curso);
        }

        const [materias] = await database.query(query, params);

        // Verificar si se encontraron materias
        if (materias.length === 0) {
            return res.status(404).json({ message: "No se encontraron materias." });
        }

        res.status(200).json(materias);
    } catch (error) {
        console.error("Error al obtener las materias:", error);
        res.status(500).json({ message: "Error al obtener las materias.", error: error.message });
    }
};

// Función para obtener notas
const obtenerNotas = async (req, res) => {
    const { ID_usuario, materia } = req.query;

    try {
        let query = "SELECT * FROM notas";
        const params = [];

        if (ID_usuario && materia) {
            query += " WHERE ID_usuario = ? AND materia = ?";
            params.push(ID_usuario, materia);
        } else if (ID_usuario) {
            query += " WHERE ID_usuario = ?";
            params.push(ID_usuario);
        } else if (materia) {
            query += " WHERE materia = ?";
            params.push(materia);
        }

        const [notas] = await database.query(query, params);

        // Verificar si se encontraron notas
        if (notas.length === 0) {
            return res.status(404).json({ message: "No se encontraron notas." });
        }

        res.status(200).json(notas);
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        res.status(500).json({ message: "Error al obtener las notas.", error: error.message });
    }
};

// Función para guardar notas
const guardarNotas = async (req, res) => {
    const notas = req.body;

    // Validar que se hayan enviado notas
    if (!notas || !Array.isArray(notas)) {
        return res.status(400).json({ message: "Datos de notas no válidos." });
    }

    try {
        // Iniciar una transacción
        await database.query("START TRANSACTION");

        for (const nota of notas) {
            // Validar que la nota tenga los campos requeridos
            if (
                !nota.ID_usuario || !nota.materia ||
                typeof nota.primer_cuatrimestre_1 === "undefined" ||
                typeof nota.primer_cuatrimestre_2 === "undefined" ||
                typeof nota.primer_cuatrimestre_nota === "undefined" ||
                typeof nota.segundo_cuatrimestre_1 === "undefined" ||
                typeof nota.segundo_cuatrimestre_2 === "undefined" ||
                typeof nota.segundo_cuatrimestre_nota === "undefined" ||
                typeof nota.nota_final === "undefined" ||
                typeof nota.nota_diciembre === "undefined" ||
                typeof nota.nota_febrero_marzo === "undefined"
            ) {
                throw new Error("Datos de nota incompletos o no válidos.");
            }

            const query = `
                INSERT INTO notas (
                    ID_usuario, materia, fecha,
                    primer_cuatrimestre_1, primer_cuatrimestre_2, primer_cuatrimestre_nota,
                    segundo_cuatrimestre_1, segundo_cuatrimestre_2, segundo_cuatrimestre_nota,
                    nota_final, nota_diciembre, nota_febrero_marzo
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    primer_cuatrimestre_1 = VALUES(primer_cuatrimestre_1),
                    primer_cuatrimestre_2 = VALUES(primer_cuatrimestre_2),
                    primer_cuatrimestre_nota = VALUES(primer_cuatrimestre_nota),
                    segundo_cuatrimestre_1 = VALUES(segundo_cuatrimestre_1),
                    segundo_cuatrimestre_2 = VALUES(segundo_cuatrimestre_2),
                    segundo_cuatrimestre_nota = VALUES(segundo_cuatrimestre_nota),
                    nota_final = VALUES(nota_final),
                    nota_diciembre = VALUES(nota_diciembre),
                    nota_febrero_marzo = VALUES(nota_febrero_marzo);
            `;

            const fecha = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD

            await database.query(query, [
                nota.ID_usuario,
                nota.materia,
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

        res.status(200).json({ 
            message: "Notas guardadas correctamente.",
            notasGuardadas: notas.length // Devolver el número de notas guardadas
        });
    } catch (error) {
        // Revertir la transacción en caso de error
        await database.query("ROLLBACK");
        console.error("Error al guardar las notas:", error);
        res.status(500).json({ 
            message: "Error al guardar las notas.",
            error: error.message // Devolver el mensaje de error específico
        });
    }
};

module.exports = { obtenerMaterias, obtenerNotas, guardarNotas };