document.addEventListener("DOMContentLoaded", () => {
    console.log("Script materiasEnlace.js cargado correctamente.");

    const materiasLink = document.getElementById('materiasLink');
    const materiasEnlace = document.getElementById('materiasEnlace');

    // Verifica si hay una sesión activa
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    console.log("Usuario en localStorage:", usuario); // Depuración

    if (!usuario) {
        console.log("No hay sesión activa. Ocultando 'Materias'."); // Depuración
        materiasLink.style.display = 'none';
    } else {
        console.log("Sesión activa. Mostrando 'Materias'."); // Depuración
        materiasLink.style.display = 'block';

        // Redirige según el rol al hacer clic en "Materias"
        materiasEnlace.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el enlace recargue la página
            console.log("Clic en 'Materias'. Rol del usuario:", usuario.rol); // Depuración

            // Normaliza el rol (elimina espacios y saltos de línea)
            const rolNormalizado = usuario.rol.trim().toLowerCase();

            if (rolNormalizado === 'alumno') {
                console.log("Redirigiendo a materias(A).html"); // Depuración
                window.location.href = 'materias(A).html';
            } else if (rolNormalizado === 'gestor de notas') {
                console.log("Redirigiendo a gestor_de_notas.html"); // Depuración
                window.location.href = 'gestor_de_notas.html';
            } else {
                alert('Rol no reconocido. Por favor, contacta al administrador.');
            }
        });
    }
});