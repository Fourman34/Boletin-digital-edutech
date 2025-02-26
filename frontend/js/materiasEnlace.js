document.addEventListener("DOMContentLoaded", () => {
    console.log("Script materiasEnlace.js cargado correctamente.");

    const materiasLink = document.getElementById('materiasLink');
    const materiasEnlace = document.getElementById('materiasEnlace');
    const adminLink = document.getElementById('adminLink'); // Enlace de Administradores

    // Verifica si hay una sesión activa
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    console.log("Usuario en localStorage:", usuario); // Depuración

    if (!usuario) {
        console.log("No hay sesión activa. Ocultando 'Materias' y 'Administradores'."); // Depuración
        materiasLink.style.display = 'none';
        adminLink.style.display = 'none'; // Oculta el enlace de Administradores
    } else {
        console.log("Sesión activa. Mostrando 'Materias'."); // Depuración
        materiasLink.style.display = 'block';

        // Normaliza el rol (elimina espacios y saltos de línea)
        const rolNormalizado = usuario.rol ? usuario.rol.trim().toLowerCase() : '';
        console.log("Rol normalizado:", rolNormalizado); // Depuración

        // Muestra u oculta el enlace de Administradores según el rol
        if (rolNormalizado === 'administrador') {
            console.log("Usuario es administrador. Mostrando 'Administradores'."); // Depuración
            adminLink.style.display = 'block';
        } else {
            console.log("Usuario no es administrador. Ocultando 'Administradores'."); // Depuración
            adminLink.style.display = 'none';
        }

        // Redirige según el rol al hacer clic en "Materias"
        materiasEnlace.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el enlace recargue la página
            console.log("Clic en 'Materias'. Rol del usuario:", usuario.rol); // Depuración

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