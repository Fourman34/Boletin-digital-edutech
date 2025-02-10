document.addEventListener("DOMContentLoaded", async () => {
    const formLogin = document.getElementById('loginForm');

    // Verificar si el usuario ya está autenticado
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
        try {
            const usuario = JSON.parse(usuarioString);
            if (usuario && usuario.ID_usuario) {
                console.log('Usuario autenticado, redirigiendo a success.html'); // Depuración
                window.location.href = 'success.html';
                return; // Salir de la función para evitar ejecuciones adicionales
            }
        } catch (error) {
            console.error('Error al parsear el usuario:', error);
            localStorage.removeItem('usuario'); // Borrar el usuario si hay un error
        }
    }

    if (!formLogin) {
        console.error("No se encontró el formulario en el DOM.");
        return;
    }

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que el formulario se recargue

        const email = e.target.email.value;
        const password = e.target.password.value;

        console.log("📤 Enviando datos al backend:", { email, password });

        try {
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Corregido
                body: JSON.stringify({ email, password })
            });

            console.log("📥 Respuesta HTTP recibida:", response);

            if (!response.ok) {
                // Si la respuesta no es exitosa, intenta obtener el mensaje de error del servidor
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('📥 Respuesta del servidor:', data);

            if (data.success) {
                alert('✅ Inicio de sesión exitoso.');
                console.log('Guardando usuario en localStorage:', data.usuario); // Depuración
                localStorage.setItem('usuario', JSON.stringify(data.usuario)); // Guardar el usuario en localStorage
                console.log('Usuario guardado en localStorage:', localStorage.getItem('usuario')); // Depuración
                console.log('Redirigiendo a success.html...'); // Depuración
                window.location.href = 'success.html'; // Redirigir directamente
            } else {
                const messageElement = document.getElementById('loginMessage');
                if (messageElement) {
                    messageElement.innerText = data.message || '❌ Correo o contraseña incorrectos.';
                }
            }
        } catch (error) {
            console.error('❌ Error en la autenticación:', error);

            const messageElement = document.getElementById('loginMessage');
            if (messageElement) {
                messageElement.innerText = error.message || '⚠️ Ocurrió un error. Inténtalo de nuevo.';
            }
        }
    });
});