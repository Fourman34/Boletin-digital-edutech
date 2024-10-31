document.addEventListener("DOMContentLoaded", function () {
    const tabla = document.getElementById("tablaNotas");
    const guardarBtn = document.getElementById("guardar");

    const claveNotas = "notas_7_1"; 

    cargarNotas();

    tabla.addEventListener("input", function (event) {
        if (event.target.tagName === "TD" && event.target.isContentEditable) {
            const valor = parseInt(event.target.textContent);
            if (isNaN(valor) || valor < 1 || valor > 10) {
                event.target.textContent = "";
            }
        }
    });

    guardarBtn.addEventListener("click", function () {
        guardarNotas();
        alert("Las notas se han guardado.");
    });

    function guardarNotas() {
        const notas = [];
        const filas = tabla.querySelectorAll("tbody tr");

        filas.forEach((fila, index) => {
            const celdas = fila.querySelectorAll("td[contenteditable]");
            const filaNotas = [];

            celdas.forEach(celda => {
                filaNotas.push(celda.textContent.trim());
            });

            notas.push(filaNotas);
        });

        // Guardar notas en localStorage usando la clave específica
        localStorage.setItem(claveNotas, JSON.stringify(notas));
    }

    function cargarNotas() {
        const notasGuardadas = localStorage.getItem(claveNotas);

        if (notasGuardadas) {
            const notas = JSON.parse(notasGuardadas);
            const filas = tabla.querySelectorAll("tbody tr");

            notas.forEach((filaNotas, index) => {
                const celdas = filas[index].querySelectorAll("td[contenteditable]");

                filaNotas.forEach((nota, i) => {
                    celdas[i].textContent = nota;
                });
            });
        }
    }
});
