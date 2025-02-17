document.addEventListener("DOMContentLoaded", function () {
    const tabla = document.getElementById("tablaNotas");
    const guardarBtn = document.getElementById("guardar");
    const exportarBtn = document.getElementById("exportar");
    const selectorMateria = document.getElementById("materia");

    // Cargar materias y alumnos al iniciar la página
    cargarMaterias();
    cargarAlumnos();

    // Validar que las notas estén entre 1 y 10
    tabla.addEventListener("input", function (event) {
        if (event.target.tagName === "TD" && event.target.isContentEditable) {
            const valor = parseFloat(event.target.textContent);
            if (isNaN(valor)) {
                event.target.textContent = "";
                alert("Por favor, ingresa un número válido.");
            } else if (valor < 1 || valor > 10) {
                event.target.textContent = "";
                alert("La nota debe estar entre 1 y 10.");
            } else {
                calcularNotaFinal(event.target);
                aplicarEstilosNotas();
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

    // Exportar notas a CSV
    exportarBtn.addEventListener("click", exportarACSV);

    // Función para cargar materias desde el servidor
    async function cargarMaterias() {
        try {
            const response = await fetch("http://localhost:3000/obtener-materias");
            if (response.ok) {
                const materias = await response.json();
                selectorMateria.innerHTML = materias.map(materia => 
                    `<option value="${materia.nombre}">${materia.nombre}</option>`
                ).join("");
            } else {
                alert("Hubo un error al cargar las materias.");
            }
        } catch (error) {
            console.error("Error al cargar las materias:", error);
        }
    }

// Función para cargar alumnos desde el servidor
async function cargarAlumnos() {
    try {
        const response = await fetch("http://localhost:3000/obtener-alumnos");
        if (response.ok) {
            const alumnos = await response.json();
            actualizarSelectorDeAlumnos(alumnos);
        } else {
            alert("Hubo un error al cargar los alumnos.");
        }
    } catch (error) {
        console.error("Error al cargar los alumnos:", error);
    }
}

// Función para actualizar el selector de alumnos
function actualizarSelectorDeAlumnos(alumnos) {
    const selectorAlumno = document.getElementById("alumno");
    selectorAlumno.innerHTML = alumnos.map(alumno => 
        `<option value="${alumno.ID_usuario}">${alumno.nombre} ${alumno.apellido}</option>`
    ).join("");
}
    // Función para calcular la nota final
    function calcularNotaFinal(celda) {
        const fila = celda.parentElement;
        const primerCuatrimestre = parseFloat(fila.cells[3].textContent);
        const segundoCuatrimestre = parseFloat(fila.cells[6].textContent);

        if (!isNaN(primerCuatrimestre) && !isNaN(segundoCuatrimestre)) {
            fila.cells[9].textContent = ((primerCuatrimestre + segundoCuatrimestre) / 2).toFixed(2);
        }
    }

    // Función para aplicar estilos a las notas
    function aplicarEstilosNotas() {
        const filas = tabla.querySelectorAll("tbody tr");
        filas.forEach(fila => {
            const notaFinal = parseFloat(fila.cells[9].textContent);
            if (!isNaN(notaFinal)) {
                fila.cells[9].classList.toggle("aprobado", notaFinal >= 6);
                fila.cells[9].classList.toggle("reprobado", notaFinal < 6);
            }
        });
    }

   // Función para obtener las notas de la tabla
function obtenerNotasDeLaTabla() {
    const notas = [];
    const filas = tabla.querySelectorAll("tbody tr");
    const selectorAlumno = document.getElementById("alumno");
    const ID_usuario = selectorAlumno.value; // Obtener el ID_usuario del alumno seleccionado

    filas.forEach(fila => {
        const celdas = fila.querySelectorAll("td[contenteditable]");
        const alumno = fila.cells[0].textContent.trim();

        const filaNotas = {
            ID_usuario: ID_usuario, // Usar el ID_usuario del alumno seleccionado
            materia: selectorMateria.value,
            primer_cuatrimestre_1: celdas[0].textContent.trim(),
            primer_cuatrimestre_2: celdas[1].textContent.trim(),
            primer_cuatrimestre_nota: celdas[2].textContent.trim(),
            segundo_cuatrimestre_1: celdas[3].textContent.trim(),
            segundo_cuatrimestre_2: celdas[4].textContent.trim(),
            segundo_cuatrimestre_nota: celdas[5].textContent.trim(),
            nota_final: fila.cells[9].textContent.trim(),
            nota_diciembre: celdas[6].textContent.trim(),
            nota_febrero_marzo: celdas[7].textContent.trim(),
        };
        notas.push(filaNotas);
    });

    return notas;
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

    // Función para exportar notas a CSV
    function exportarACSV() {
        const filas = tabla.querySelectorAll("tbody tr");
        let csvContent = "data:text/csv;charset=utf-8,";

        // Encabezados
        csvContent += "Alumno,Primer Cuatrimestre 1,Primer Cuatrimestre 2,Primer Cuatrimestre Nota,Segundo Cuatrimestre 1,Segundo Cuatrimestre 2,Segundo Cuatrimestre Nota,Nota Final,Nota Diciembre,Nota Febrero/Marzo\n";

        // Datos
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll("td");
            const filaData = Array.from(celdas).map(celda => celda.textContent).join(",");
            csvContent += filaData + "\n";
        });

        // Descargar archivo
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "notas.csv");
        document.body.appendChild(link);
        link.click();
    }

    // Función para agregar una materia
    async function agregarMateria() {
        const nombreMateria = document.getElementById("nombreMateria").value;

        try {
            const response = await fetch("http://localhost:3000/agregar-materia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre: nombreMateria, curso: "7°1" }),
            });

            if (response.ok) {
                alert("Materia agregada correctamente.");
                cargarMaterias(); // Recargar la lista de materias
            } else {
                alert("Hubo un error al agregar la materia.");
            }
        } catch (error) {
            console.error("Error al agregar la materia:", error);
        }
    }

    // Función para agregar un alumno
    async function agregarAlumno() {
        const nombreAlumno = document.getElementById("nombreAlumno").value;
        const apellidoAlumno = document.getElementById("apellidoAlumno").value;

        try {
            const response = await fetch("http://localhost:3000/agregar-alumno", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre: nombreAlumno, apellido: apellidoAlumno, curso: "7°1" }),
            });

            if (response.ok) {
                alert("Alumno agregado correctamente.");
                cargarAlumnos(); // Recargar la lista de alumnos
            } else {
                alert("Hubo un error al agregar el alumno.");
            }
        } catch (error) {
            console.error("Error al agregar el alumno:", error);
        }
    }
});