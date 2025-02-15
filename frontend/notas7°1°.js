document.addEventListener("DOMContentLoaded", function () {
    const tabla = document.getElementById("tablaNotas");
    const guardarBtn = document.getElementById("guardar");
    const selectorMateria = document.getElementById("materia");

    const claveNotas = "notas_7_1";

    // Cargar notas al iniciar la página
    cargarNotasDesdeServidor();

    // Validar que las notas estén entre 1 y 10
    tabla.addEventListener("input", function (event) {
        if (event.target.tagName === "TD" && event.target.isContentEditable) {
            const valor = parseInt(event.target.textContent);
            if (isNaN(valor)) {  // Aquí estaba el error
                event.target.textContent = "";
                alert("Por favor, ingresa un número válido.");
            } else if (valor < 1 || valor > 10) {
                event.target.textContent = "";
                alert("La nota debe estar entre 1 y 10.");
            }
        }
    });

    // Guardar notas al hacer clic en el botón
    guardarBtn.addEventListener("click", async function () {
        const notas = obtenerNotasDeLaTabla();
        const resultado = await enviarNotasAlServidor(notas);

        if (resultado === "éxito") {
            alert("Notas guardadas correctamente.");
        } else {
            alert("Hubo un error al guardar las notas.");
        }
    });

    // Cargar notas desde el servidor al cambiar la materia
    selectorMateria.addEventListener("change", cargarNotasDesdeServidor);

    // Función para obtener las notas de la tabla
    function obtenerNotasDeLaTabla() {
        const notas = [];
        const filas = tabla.querySelectorAll("tbody tr");

        // Ignorar las primeras dos filas (encabezados)
        for (let i = 2; i < filas.length; i++) {
            const fila = filas[i];
            const celdas = fila.querySelectorAll("td[contenteditable]");
            const alumno = fila.cells[0].textContent.trim();

            const filaNotas = {
                alumno: alumno,
                materia: selectorMateria.value,
                primer_cuatrimestre_1: celdas[0].textContent.trim(),
                primer_cuatrimestre_2: celdas[1].textContent.trim(),
                primer_cuatrimestre_nota: celdas[2].textContent.trim(),
                segundo_cuatrimestre_1: celdas[3].textContent.trim(),
                segundo_cuatrimestre_2: celdas[4].textContent.trim(),
                segundo_cuatrimestre_nota: celdas[5].textContent.trim(),
                nota_final: celdas[6].textContent.trim(),
                nota_diciembre: celdas[7].textContent.trim(),
                nota_febrero_marzo: celdas[8].textContent.trim(),
            };
            notas.push(filaNotas);
        }

        return notas;
    }

    // Función para cargar notas desde el servidor
    async function cargarNotasDesdeServidor() {
        const materia = selectorMateria.value;

        try {
            const response = await fetch(`http://localhost:3000/obtener-notas?materia=${materia}`);
            if (response.ok) {
                const notas = await response.json();
                actualizarTablaConNotas(notas);
            } else {
                alert("Hubo un error al cargar las notas desde el servidor.");
            }
        } catch (error) {
            console.error("Error al cargar las notas:", error);
        }
    }

    // Función para actualizar la tabla con las notas cargadas
    function actualizarTablaConNotas(notas) {
        const filas = tabla.querySelectorAll("tbody tr");

        // Ignorar las primeras dos filas (encabezados)
        for (let i = 2; i < filas.length; i++) {
            const fila = filas[i];
            const celdas = fila.querySelectorAll("td[contenteditable]");
            const alumnoNotas = notas.find(nota => nota.alumno === fila.cells[0].textContent.trim());

            if (alumnoNotas) {
                celdas[0].textContent = alumnoNotas.primer_cuatrimestre_1;
                celdas[1].textContent = alumnoNotas.primer_cuatrimestre_2;
                celdas[2].textContent = alumnoNotas.primer_cuatrimestre_nota;
                celdas[3].textContent = alumnoNotas.segundo_cuatrimestre_1;
                celdas[4].textContent = alumnoNotas.segundo_cuatrimestre_2;
                celdas[5].textContent = alumnoNotas.segundo_cuatrimestre_nota;
                celdas[6].textContent = alumnoNotas.nota_final;
                celdas[7].textContent = alumnoNotas.nota_diciembre;
                celdas[8].textContent = alumnoNotas.nota_febrero_marzo;
            }
        }
    }

    // Función para enviar notas al servidor
    async function enviarNotasAlServidor(notas) {
        try {
            const response = await fetch("http://localhost:3000/guardar-notas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(notas),
            });

            if (response.ok) {
                return "éxito";
            } else {
                return "error";
            }
        } catch (error) {
            console.error("Error al enviar las notas:", error);
            return "error";
        }
    }
});