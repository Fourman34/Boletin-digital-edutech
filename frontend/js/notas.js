document.addEventListener("DOMContentLoaded", function () {
    const tabla = document.getElementById("tablaNotas");
    const guardarBtn = document.getElementById("guardar");
    const exportarBtn = document.getElementById("exportar");
    const agregarFilaBtn = document.getElementById("agregarFila");
    const selectorMateria = document.getElementById("materia"); // Puede ser null si no existe en el DOM
    const selectorAlumno = document.getElementById("alumno");

    // Obtener el curso desde un campo oculto en el HTML
    const curso = document.getElementById("curso").value;
    console.log("Curso seleccionado:", curso); // Depuración

    // Cargar materias y alumnos al iniciar la página
    if (selectorMateria) cargarMaterias(curso); // Solo cargar materias si el selector existe
    cargarAlumnos(curso);

    // Evento para agregar una nueva fila
    agregarFilaBtn.addEventListener("click", function () {
        const tbody = tabla.querySelector("tbody");
        const nuevaFila = `
            <tr>
                <td colspan="3">${selectorAlumno.options[selectorAlumno.selectedIndex].text}</td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td><button class="eliminarFila">Eliminar</button></td>
            </tr>
        `;
        tbody.innerHTML += nuevaFila;
    });

    // Evento para eliminar una fila y borrar las notas de la base de datos
    tabla.addEventListener("click", async function (event) {
        if (event.target.classList.contains("eliminarFila")) {
            const fila = event.target.closest("tr");
            const ID_usuario = selectorAlumno.value; // Obtener el ID_usuario del alumno seleccionado
            const materia = selectorMateria ? selectorMateria.value : null; // Obtener la materia seleccionada si existe

            // Confirmar la eliminación
            const confirmar = confirm("¿Estás seguro de que deseas eliminar estas notas?");
            if (confirmar) {
                try {
                    // Enviar solicitud al servidor para eliminar las notas
                    const response = await fetch("http://localhost:3000/eliminar-notas", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ ID_usuario, materia, curso }),
                    });

                    if (response.ok) {
                        // Eliminar la fila de la tabla
                        fila.remove();
                        alert("Notas eliminadas correctamente.");
                    } else {
                        throw new Error(`Error al eliminar las notas: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error("Error al eliminar las notas:", error);
                    alert("Hubo un error al eliminar las notas. Por favor, intenta nuevamente.");
                }
            }
        }
    });

    // Evento para cargar notas cuando se cambia el alumno o la materia
    selectorAlumno.addEventListener("change", cargarNotas);
    if (selectorMateria) selectorMateria.addEventListener("change", cargarNotas); // Solo si existe el selector

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

    // Evento para guardar notas al hacer clic en el botón
    guardarBtn.addEventListener("click", async function () {
        const notas = obtenerNotasDeLaTabla();
        const resultado = await enviarNotasAlServidor(notas);

        if (resultado === "éxito") {
            alert("Notas guardadas correctamente.");
        } else {
            alert("Hubo un error al guardar las notas.");
        }
    });

    // Evento para exportar notas a CSV
    exportarBtn.addEventListener("click", exportarACSV);

    // Función para cargar materias desde el servidor
    async function cargarMaterias(curso) {
        try {
            console.log("Cargando materias para el curso:", curso); // Depuración
            const response = await fetch(`http://localhost:3000/obtener-materias?curso=${curso}`);
            console.log("Respuesta del servidor:", response); // Depuración
    
            if (!response.ok) {
                throw new Error(`Error al cargar las materias: ${response.statusText}`);
            }
    
            const materias = await response.json();
            console.log("Materias obtenidas:", materias); // Depuración
    
            const selectorMateria = document.getElementById("materia");
            if (selectorMateria) {
                selectorMateria.innerHTML = materias.map(materia => 
                    `<option value="${materia.nombre}">${materia.nombre}</option>`
                ).join("");
            } else {
                console.error("El selector de materias no fue encontrado en el DOM."); // Depuración
            }
        } catch (error) {
            console.error("Error al cargar las materias:", error);
            alert("Hubo un error al cargar las materias. Por favor, intenta nuevamente.");
        }
    }

    // Función para cargar alumnos desde el servidor
    async function cargarAlumnos(curso) {
        try {
            const response = await fetch(`http://localhost:3000/obtener-alumnos?curso=${curso}`);
            if (!response.ok) {
                throw new Error(`Error al cargar los alumnos: ${response.statusText}`);
            }
            const alumnos = await response.json();
            selectorAlumno.innerHTML = alumnos.map(alumno => 
                `<option value="${alumno.ID_usuario}">${alumno.nombre} ${alumno.apellido}</option>`
            ).join("");
        } catch (error) {
            console.error("Error al cargar los alumnos:", error);
            alert("Hubo un error al cargar los alumnos. Por favor, intenta nuevamente.");
        }
    }

    // Función para cargar las notas del alumno y materia seleccionados
    async function cargarNotas() {
        const ID_usuario = selectorAlumno.value; // Obtener el ID_usuario del alumno seleccionado
        const materia = selectorMateria ? selectorMateria.value : null; // Obtener la materia seleccionada si existe

        if (!ID_usuario) {
            alert("Por favor, selecciona un alumno.");
            return;
        }

        try {
            console.log("Enviando solicitud para obtener notas...");
            const url = materia 
                ? `http://localhost:3000/obtener-notas?ID_usuario=${ID_usuario}&materia=${materia}&curso=${curso}`
                : `http://localhost:3000/obtener-notas?ID_usuario=${ID_usuario}&curso=${curso}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
            }

            const notas = await response.json();
            console.log("Notas obtenidas:", notas);
            actualizarTablaConNotas(notas); // Actualizar la tabla con las notas obtenidas
        } catch (error) {
            console.error("Error al cargar las notas:", error);
            alert("Hubo un error al cargar las notas. Por favor, intenta nuevamente.");
        }
    }

    // Función para actualizar la tabla con las notas
    function actualizarTablaConNotas(notas) {
        const tbody = tabla.querySelector("tbody");
        tbody.innerHTML = ""; // Limpiar la tabla antes de cargar nuevas notas

        if (notas.length === 0) {
            // Si no hay notas, agregar una fila vacía para ingresar datos
            tbody.innerHTML = `
                <tr>
                    <td colspan="3">${selectorAlumno.options[selectorAlumno.selectedIndex].text}</td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td></td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td><button class="eliminarFila">Eliminar</button></td>
                </tr>
            `;
        } else {
            // Si hay notas, llenar la tabla con los datos
            notas.forEach(nota => {
                const fila = `
                    <tr>
                        <td colspan="3">${selectorAlumno.options[selectorAlumno.selectedIndex].text}</td>
                        <td contenteditable="true">${nota.primer_cuatrimestre_1 || ''}</td>
                        <td contenteditable="true">${nota.primer_cuatrimestre_2 || ''}</td>
                        <td contenteditable="true">${nota.primer_cuatrimestre_nota || ''}</td>
                        <td contenteditable="true">${nota.segundo_cuatrimestre_1 || ''}</td>
                        <td contenteditable="true">${nota.segundo_cuatrimestre_2 || ''}</td>
                        <td contenteditable="true">${nota.segundo_cuatrimestre_nota || ''}</td>
                        <td>${nota.nota_final || ''}</td>
                        <td contenteditable="true">${nota.nota_diciembre || ''}</td>
                        <td contenteditable="true">${nota.nota_febrero_marzo || ''}</td>
                        <td><button class="eliminarFila">Eliminar</button></td>
                    </tr>
                `;
                tbody.innerHTML += fila;
            });
        }
    }

    // Función para obtener las notas de la tabla
    function obtenerNotasDeLaTabla() {
        const notas = [];
        const filas = tabla.querySelectorAll("tbody tr");
        const ID_usuario = selectorAlumno.value; // Obtener el ID_usuario del alumno seleccionado
        const materia = selectorMateria ? selectorMateria.value : null; // Obtener la materia seleccionada si existe

        filas.forEach(fila => {
            const celdas = fila.querySelectorAll("td[contenteditable]");

            const filaNotas = {
                ID_usuario: ID_usuario,
                materia: materia, // Usar la materia seleccionada si existe
                curso: curso, // Incluir el curso en la nota
                primer_cuatrimestre_1: convertirValor(celdas[0].textContent.trim()),
                primer_cuatrimestre_2: convertirValor(celdas[1].textContent.trim()),
                primer_cuatrimestre_nota: convertirValor(celdas[2].textContent.trim()),
                segundo_cuatrimestre_1: convertirValor(celdas[3].textContent.trim()),
                segundo_cuatrimestre_2: convertirValor(celdas[4].textContent.trim()),
                segundo_cuatrimestre_nota: convertirValor(celdas[5].textContent.trim()),
                nota_final: convertirValor(fila.cells[9].textContent.trim()),
                nota_diciembre: convertirValor(celdas[6].textContent.trim()),
                nota_febrero_marzo: convertirValor(celdas[7].textContent.trim()),
            };
            notas.push(filaNotas);
        });

        return notas;
    }

    // Función para convertir valores vacíos a null
    function convertirValor(valor) {
        return valor === "" ? null : parseFloat(valor);
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
                throw new Error(`Error al enviar las notas: ${response.statusText}`);
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
            const filaData = Array.from(celdas).map(celda => celda.textContent.trim()).join(",");
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

    // Función para calcular la nota final
    function calcularNotaFinal(celda) {
        const fila = celda.parentElement;
        const primerCuatrimestre = parseFloat(fila.cells[3].textContent);
        const segundoCuatrimestre = parseFloat(fila.cells[6].textContent);

        if (!isNaN(primerCuatrimestre) && !isNaN(segundoCuatrimestre)) {
            fila.cells[9].textContent = ((primerCuatrimestre + segundoCuatrimestre) / 2).toFixed(2);
        } else {
            fila.cells[9].textContent = "";
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
            } else {
                fila.cells[9].classList.remove("aprobado", "reprobado");
            }
        });
    }
});