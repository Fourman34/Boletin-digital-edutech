console.log("matricularse.js cargado correctamente");

document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM completamente cargado");

    const formLogin = document.getElementById('loginForm');
    console.log("Formulario:", formLogin);

    if (!formLogin) {
        console.error("No se encontró el formulario en el DOM.");
        return;
    }

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Formulario enviado");

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
            console.log("Respuesta recibida:", response);
        
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error en la respuesta del servidor:', errorData); // Depuración
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }
        
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
                } else {
                    window.location.href = 'success.html';
                }
            } else {
                const messageElement = document.getElementById('loginMessage');
                if (messageElement) {
                    messageElement.innerText = data.message || '❌ Correo o contraseña incorrectos.';
                }
            }
        } catch (error) {
            console.error('❌ Error en la solicitud HTTP:', error);
        
            const messageElement = document.getElementById('loginMessage');
            if (messageElement) {
                messageElement.innerText = '⚠️ Ocurrió un error. Inténtalo de nuevo.';
            }
        }
    })
})
