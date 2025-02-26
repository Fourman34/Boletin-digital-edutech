<<<<<<< HEAD:frontend/matricularse.js
document.addEventListener("DOMContentLoaded", async () => {
    const formLogin = document.getElementById('loginForm');

    // Función para verificar si el servidor está activo
    const verificarServidorActivo = async () => {
        try {
            const response = await fetch('http://localhost:3000/health-check'); // Endpoint de verificación
            return response.ok; // Devuelve true si el servidor responde correctamente
        } catch (error) {
            console.error('El servidor no está activo:', error);
            return false; // Devuelve false si hay un error
        }
    };

    // Borrar localStorage cuando el servidor no esté activo
    const servidorActivo = await verificarServidorActivo();
    if (!servidorActivo) {
        console.log('El servidor no está activo, borrando localStorage...'); // Depuración
        localStorage.removeItem('usuario'); // Borrar el usuario del localStorage
    }

    // Verificar si el usuario ya está autenticado
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
        try {
            const usuario = JSON.parse(usuarioString);
            if (usuario && usuario.ID_usuario) {
                console.log('Usuario autenticado, verificando existencia de success.html...'); // Depuración

                // Verificar si success.html existe antes de redirigir
                fetch('success.html')
                    .then(response => {
                        if (response.ok) {
                            console.log('success.html existe, redirigiendo...'); // Depuración
                            window.location.href = 'success.html';
                        } else {
                            console.log('success.html no existe, evitando redirección.'); // Depuración
                        }
                    })
                    .catch(error => {
                        console.error('Error al verificar success.html:', error); // Depuración
                    });
                return; // Salir de la función para evitar ejecuciones adicionales
            }
        } catch (error) {
            console.error('Error al parsear el usuario:', error);
        }
    }
=======
console.log("matricularse.js cargado correctamente");

document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM completamente cargado");

    const formLogin = document.getElementById('loginForm');
    console.log("Formulario:", formLogin);
>>>>>>> Corrigiendo-probando:frontend/js/matricularse.js

    if (!formLogin) {
        console.error("No se encontró el formulario en el DOM.");
        return;
    }

<<<<<<< HEAD:frontend/matricularse.js
    // Temporizador de inactividad
    let temporizadorInactividad;

    const reiniciarTemporizador = () => {
        // Reiniciar el temporizador cada vez que el usuario interactúe
        clearTimeout(temporizadorInactividad);
        temporizadorInactividad = setTimeout(() => {
            console.log('Usuario inactivo, borrando localStorage...'); // Depuración
            localStorage.removeItem('usuario'); // Borrar el usuario del localStorage
        }, 1800000); // 30 minutos de inactividad (en milisegundos)
    };

    // Reiniciar el temporizador en eventos de interacción del usuario
    document.addEventListener('mousemove', reiniciarTemporizador);
    document.addEventListener('keypress', reiniciarTemporizador);
    document.addEventListener('click', reiniciarTemporizador);

    // Iniciar el temporizador al cargar la página
    reiniciarTemporizador();

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
=======
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Formulario enviado");
>>>>>>> Corrigiendo-probando:frontend/js/matricularse.js

        const email = e.target.email.value;
        const password = e.target.password.value;

        console.log("📤 Enviando datos al backend:", { email, password });

        try {
            console.log("Enviando solicitud al servidor...");
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
<<<<<<< HEAD:frontend/matricularse.js

            console.log("📥 Respuesta HTTP recibida:", response);

=======
            console.log("Respuesta recibida:", response);
        
>>>>>>> Corrigiendo-probando:frontend/js/matricularse.js
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error en la respuesta del servidor:', errorData); // Depuración
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }
<<<<<<< HEAD:frontend/matricularse.js

            const data = await response.json();
            console.log('📥 Respuesta del servidor:', data);

            if (data.success) {
                alert('✅ Inicio de sesión exitoso.');
                console.log('Usuario guardado en localStorage:', data.user); // Depuración
                localStorage.setItem('usuario', JSON.stringify(data.user)); // Guardar el usuario en localStorage

                // Verificar si success.html existe antes de redirigir
                fetch('success.html')
                    .then(response => {
                        if (response.ok) {
                            console.log('success.html existe, redirigiendo...'); // Depuración
                            window.location.href = 'success.html';
                        } else {
                            console.log('success.html no existe, evitando redirección.'); // Depuración
                        }
                    })
                    .catch(error => {
                        console.error('Error al verificar success.html:', error); // Depuración
                    });
=======
        
            const data = await response.json();
            console.log('📥 Respuesta del servidor:', data);
        
            if (data.success) {
                alert('✅ Inicio de sesión exitoso.');
                console.log('Usuario recibido del servidor:', data.user);
                localStorage.setItem('usuario', JSON.stringify(data.user));
                console.log('Usuario guardado en localStorage:', localStorage.getItem('usuario'));
        
                if (data.user.rol === 'Alumno') {
                    window.location.href = 'materias(A).html';
                } else if (data.user.rol === 'Gestor de notas') {
                    window.location.href = 'gestor_de_notas.html';
                } else if (data.user.rol === 'administrador'){
                    window.location.href = 'administrador.html';
                } else {
                    window.location.href = 'success.html';
                }
>>>>>>> Corrigiendo-probando:frontend/js/matricularse.js
            } else {
                const messageElement = document.getElementById('loginMessage');
                if (messageElement) {
                    messageElement.innerText = data.message || '❌ Correo o contraseña incorrectos.';
                }
            }
        } catch (error) {
<<<<<<< HEAD:frontend/matricularse.js
            console.error('❌ Error en la autenticación:', error);

=======
            console.error('❌ Error en la solicitud HTTP:', error);
        
>>>>>>> Corrigiendo-probando:frontend/js/matricularse.js
            const messageElement = document.getElementById('loginMessage');
            if (messageElement) {
                messageElement.innerText = '⚠️ Ocurrió un error. Inténtalo de nuevo.';
            }
        }
<<<<<<< HEAD:frontend/matricularse.js
    });
});
=======
    })
})
>>>>>>> Corrigiendo-probando:frontend/js/matricularse.js
