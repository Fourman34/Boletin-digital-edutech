// notas.js

// Función para cargar las materias desde el backend
async function cargarMaterias() {
    try {
        const response = await fetch("http://localhost:3000/obtener-materias");
        if (response.ok) {
            const materias = await response.json();
            const selectorMateria = document.getElementById("materia");
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

// Evento para cargar las materias al iniciar la página
document.addEventListener("DOMContentLoaded", cargarMaterias);

// Evento para guardar automáticamente al editar una celda
const tabla = document.getElementById("tablaNotas");
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