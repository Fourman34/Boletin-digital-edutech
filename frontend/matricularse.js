document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById('loginForm');

    // Verificar si el usuario ya está autenticado
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
        try {
            const usuario = JSON.parse(usuarioString);
            if (usuario && usuario.ID_usuario) { // Verificar que el usuario tenga un ID válido
                console.log('Usuario autenticado, redirigiendo a success.html'); // Depuración
                window.location.href = 'success.html';
                return;
            }
        } catch (error) {
            console.error('Error al parsear el usuario:', error);
        }
    }

    if (!formLogin) {
        console.error("No se encontró el formulario en el DOM.");
        return;
    }

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        console.log("📤 Enviando datos al backend:", { email, password });

        try {
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                console.log('Usuario guardado en localStorage:', data.user); // Depuración
                localStorage.setItem('usuario', JSON.stringify(data.user)); // Guardar el usuario en localStorage
                console.log('Redirigiendo a success.html...'); // Depuración
                window.location.href = 'success.html'; // Redirigir a success.html
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