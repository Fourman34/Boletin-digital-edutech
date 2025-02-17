// Variables globales
const tabla = document.getElementById("tablaNotas");
const selectorMateria = document.getElementById("materia");
const selectorAlumno = document.getElementById("alumno"); // Selector de alumnos

// Función para cargar las materias desde el backend
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

// Función para cargar los alumnos desde el backend
async function cargarAlumnos() {
    try {
        const response = await fetch("http://localhost:3000/obtener-alumnos");
        if (response.ok) {
            const alumnos = await response.json();
            selectorAlumno.innerHTML = alumnos.map(alumno => 
                `<option value="${alumno.ID_usuario}">${alumno.nombre} ${alumno.apellido}</option>`
            ).join("");
        } else {
            alert("Hubo un error al cargar los alumnos.");
        }
    } catch (error) {
        console.error("Error al cargar los alumnos:", error);
    }
}

// Función para cargar notas desde el backend
async function cargarNotasDesdeServidor() {
    const materia = selectorMateria.value;
    const ID_usuario = selectorAlumno.value; // Obtener el ID del alumno seleccionado

    try {
        const response = await fetch(`http://localhost:3000/obtener-notas?ID_usuario=${ID_usuario}&materia=${materia}`);
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
    const tbody = tabla.querySelector("tbody");
    tbody.innerHTML = notas.map(nota => `
        <tr>
            <td colspan="3">${nota.alumno}</td>
            <td contenteditable="true">${nota.primer_cuatrimestre_1}</td>
            <td contenteditable="true">${nota.primer_cuatrimestre_2}</td>
            <td contenteditable="true">${nota.primer_cuatrimestre_nota}</td>
            <td contenteditable="true">${nota.segundo_cuatrimestre_1}</td>
            <td contenteditable="true">${nota.segundo_cuatrimestre_2}</td>
            <td contenteditable="true">${nota.segundo_cuatrimestre_nota}</td>
            <td>${nota.nota_final}</td>
            <td contenteditable="true">${nota.nota_diciembre}</td>
            <td contenteditable="true">${nota.nota_febrero_marzo}</td>
        </tr>
    `).join("");
    aplicarEstilosNotas();
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

// Función para calcular la nota final
function calcularNotaFinal(primerCuatrimestre, segundoCuatrimestre) {
    return ((primerCuatrimestre + segundoCuatrimestre) / 2).toFixed(2);
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

// Función para obtener las notas de la tabla
function obtenerNotasDeLaTabla() {
    const notas = [];
    const filas = tabla.querySelectorAll("tbody tr");

    filas.forEach(fila => {
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

// Evento para cargar las materias, alumnos y notas al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarMaterias();
    cargarAlumnos();
    cargarNotasDesdeServidor();
});

// Evento para cargar notas cuando se cambia la materia o el alumno
selectorMateria.addEventListener("change", cargarNotasDesdeServidor);
selectorAlumno.addEventListener("change", cargarNotasDesdeServidor);

// Evento para guardar automáticamente al editar una celda
tabla.addEventListener("input", async function (event) {
    if (event.target.tagName === "TD" && event.target.isContentEditable) {
        const notas = obtenerNotasDeLaTabla();
        const resultado = await enviarNotasAlServidor(notas);
        if (resultado === "éxito") {
            console.log("Notas guardadas automáticamente.");
        } else {
            alert("Hubo un error al guardar las notas.");
        }
    }
});

// Evento para calcular la nota final al editar una celda
tabla.addEventListener("input", function (event) {
    if (event.target.tagName === "TD" && event.target.isContentEditable) {
        const fila = event.target.parentElement;
        const primerCuatrimestre = parseFloat(fila.cells[3].textContent);
        const segundoCuatrimestre = parseFloat(fila.cells[6].textContent);

        if (!isNaN(primerCuatrimestre) && !isNaN(segundoCuatrimestre)) {
            fila.cells[9].textContent = calcularNotaFinal(primerCuatrimestre, segundoCuatrimestre);
        }
    }
});

// Evento para exportar notas a CSV
document.getElementById("exportar").addEventListener("click", exportarACSV);