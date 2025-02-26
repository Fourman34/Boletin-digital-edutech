const express = require('express');
const path = require('path');
<<<<<<< HEAD
const database = require('./database'); // Ruta corregida
const { verificarGestor } = require('../middlewares/authMiddleware'); // Ruta corregida
const userRoutes = require('../routes/user.routes.js'); // Ruta corregida
=======
const cors = require('cors'); // Importa el módulo CORS
const database = require('./database'); // Ruta corregida
const userRoutes = require('../routes/user.routes.js');
>>>>>>> Corrigiendo-probando
const notasRoutes = require('../routes/notas.routes.js'); // Ruta corregida

const app = express();
app.use(cors());

app.set('port', 3000);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/user', userRoutes); // Ruta para manejar usuarios
app.use('/notas', notasRoutes); // Ruta para manejar notas

// Ruta para obtener notas del alumno que inició sesión
app.get("/obtener-notas", async (req, res) => {
<<<<<<< HEAD
    const { ID_usuario } = req.query; // Obtener el ID_usuario del query
=======
    const { ID_usuario, materia } = req.query;
>>>>>>> Corrigiendo-probando

    if (!ID_usuario) {
        return res.status(400).json({ message: "ID_usuario es requerido." });
    }

    try {
<<<<<<< HEAD
        const query = "SELECT * FROM notas WHERE ID_usuario = ?";
        const [notas] = await database.query(query, [ID_usuario]);
=======
        let query;
        let params;

        if (materia) {
            query = "SELECT * FROM notas WHERE ID_usuario = ? AND materia = ?";
            params = [ID_usuario, materia];
        } else {
            query = "SELECT * FROM notas WHERE ID_usuario = ?";
            params = [ID_usuario];
        }

        const [notas] = await database.query(query, params);
>>>>>>> Corrigiendo-probando
        res.status(200).json(notas);
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        res.status(500).json({ message: "Error al obtener las notas." });
    }
});

<<<<<<< HEAD
// Ruta para guardar notas (protegida por el middleware verificarGestor)
app.post("/guardar-notas", verificarGestor, async (req, res) => {
    const notas = req.body;

    try {
        // Iniciar una transacción
=======
// Ruta para guardar notas
app.post("/guardar-notas", async (req, res) => {
    const notas = req.body;

    if (!notas || !Array.isArray(notas)) {
        return res.status(400).json({ message: "Datos de notas no válidos." });
    }

    try {
>>>>>>> Corrigiendo-probando
        await database.query("START TRANSACTION");

        for (const nota of notas) {
            const query = `
                INSERT INTO notas (
<<<<<<< HEAD
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
=======
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
>>>>>>> Corrigiendo-probando
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

<<<<<<< HEAD
        // Confirmar la transacción
        await database.query("COMMIT");

        res.status(200).json({ message: "Notas guardadas correctamente." });
    } catch (error) {
        // Revertir la transacción en caso de error
=======
        await database.query("COMMIT");
        res.status(200).json({ message: "Notas guardadas correctamente." });
    } catch (error) {
>>>>>>> Corrigiendo-probando
        await database.query("ROLLBACK");
        console.error("Error al guardar las notas:", error);
        res.status(500).json({ message: "Error al guardar las notas." });
    }
});

<<<<<<< HEAD
// Ruta para obtener materias
app.get("/obtener-materias", async (req, res) => {
    try {
        const query = "SELECT * FROM materias WHERE curso = '7°1'"; // Filtra por curso
        const [materias] = await database.query(query);
=======
// Ruta para eliminar notas
app.delete("/eliminar-notas", async (req, res) => {
    const { ID_usuario, materia } = req.body;

    if (!ID_usuario || !materia) {
        return res.status(400).json({ message: "ID_usuario y materia son requeridos." });
    }

    try {
        const query = "DELETE FROM notas WHERE ID_usuario = ? AND materia = ?";
        await database.query(query, [ID_usuario, materia]);
        res.status(200).json({ message: "Notas eliminadas correctamente." });
    } catch (error) {
        console.error("Error al eliminar las notas:", error);
        res.status(500).json({ message: "Error al eliminar las notas." });
    }
});

// Ruta para obtener materias por curso
app.get("/obtener-materias", async (req, res) => {
    const { curso } = req.query;

    if (!curso) {
        return res.status(400).json({ message: "El parámetro 'curso' es requerido." });
    }

    try {
        const query = "SELECT * FROM materias WHERE curso = ?";
        const [materias] = await database.query(query, [curso]);
>>>>>>> Corrigiendo-probando
        res.status(200).json(materias);
    } catch (error) {
        console.error("Error al obtener las materias:", error);
        res.status(500).json({ message: "Error al obtener las materias." });
    }
});

<<<<<<< HEAD
// Ruta para obtener alumnos del curso "7°1" con rol 1 (alumno)
app.get("/obtener-alumnos", async (req, res) => {
    try {
        const query = "SELECT * FROM usuarios WHERE ID_rol = 1 AND curso = '7°1'"; // Filtrar por rol 1 (alumno) y curso
        const [alumnos] = await database.query(query);
=======
// Ruta para obtener alumnos por curso
app.get("/obtener-alumnos", async (req, res) => {
    const { curso } = req.query;

    if (!curso) {
        return res.status(400).json({ message: "El parámetro 'curso' es requerido." });
    }

    try {
        const query = "SELECT * FROM usuarios WHERE ID_rol = 1 AND curso = ?";
        const [alumnos] = await database.query(query, [curso]);
>>>>>>> Corrigiendo-probando
        res.status(200).json(alumnos);
    } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        res.status(500).json({ message: "Error al obtener los alumnos." });
    }
});

// Ruta para agregar una materia
app.post("/agregar-materia", async (req, res) => {
    const { nombre, curso } = req.body;

<<<<<<< HEAD
=======
    if (!nombre || !curso) {
        return res.status(400).json({ message: "Nombre y curso son requeridos." });
    }

>>>>>>> Corrigiendo-probando
    try {
        const query = "INSERT INTO materias (nombre, curso) VALUES (?, ?)";
        await database.query(query, [nombre, curso]);
        res.status(201).json({ message: "Materia agregada correctamente." });
    } catch (error) {
        console.error("Error al agregar la materia:", error);
        res.status(500).json({ message: "Error al agregar la materia." });
    }
});

// Ruta para agregar un alumno
app.post("/agregar-alumno", async (req, res) => {
    const { nombre, apellido, curso } = req.body;

<<<<<<< HEAD
=======
    if (!nombre || !apellido || !curso) {
        return res.status(400).json({ message: "Nombre, apellido y curso son requeridos." });
    }

>>>>>>> Corrigiendo-probando
    try {
        const query = "INSERT INTO alumnos (nombre, apellido, curso) VALUES (?, ?, ?)";
        await database.query(query, [nombre, apellido, curso]);
        res.status(201).json({ message: "Alumno agregado correctamente." });
    } catch (error) {
        console.error("Error al agregar el alumno:", error);
        res.status(500).json({ message: "Error al agregar el alumno." });
    }
});

<<<<<<< HEAD
// Función para obtener el ID_usuario por nombre
async function obtenerIdUsuarioPorNombre(nombre) {
    const query = "SELECT ID_usuario FROM usuarios WHERE nombre = ?";
    const [result] = await database.query(query, [nombre]);
    return result.length > 0 ? result[0].ID_usuario : null;
}

=======
>>>>>>> Corrigiendo-probando
// Ruta para obtener los datos de un usuario por su ID
app.get('/user/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la URL

    try {
<<<<<<< HEAD
        // Realizar una consulta a la base de datos para obtener el usuario por ID
=======
>>>>>>> Corrigiendo-probando
        const query = "SELECT * FROM usuarios WHERE ID_usuario = ?";
        const [user] = await database.query(query, [id]);

        if (user.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.status(200).json(user[0]); // Retornar los datos del usuario
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({ message: "Error al obtener el usuario." });
    }
});
<<<<<<< HEAD
=======

// Ruta para obtener todos los usuarios
app.get('/user', async (req, res) => {
    try {
        const query = "SELECT usuarios.*, roles.nombre_rol FROM usuarios JOIN roles ON usuarios.ID_rol = roles.ID_rol";
        const [usuarios] = await database.query(query);
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).json({ message: "Error al obtener los usuarios." });
    }
});

// Ruta para eliminar un usuario
app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = "DELETE FROM usuarios WHERE ID_usuario = ?";
        await database.query(query, [id]);
        res.status(200).json({ message: "Usuario eliminado correctamente." });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ message: "Error al eliminar el usuario." });
    }
});
>>>>>>> Corrigiendo-probando

// Servir archivos estáticos (frontend)
const frontendPath = path.join(__dirname, '../../../frontend');
app.use(express.static(frontendPath));

// Ruta principal para servir el archivo HTML
app.get('/', (req, res) => {
    const indexPath = path.join(frontendPath, 'index1.html');
    res.sendFile(indexPath);
});

// Manejo de errores 404 (Ruta no encontrada)
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error en el servidor' });
});

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});
