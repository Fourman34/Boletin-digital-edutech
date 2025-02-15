const formUpdate = document.getElementById('updateForm'); // El formulario para actualizar datos

formUpdate.addEventListener('submit', async (e) => {
    e.preventDefault();  // Evitar el comportamiento predeterminado del formulario

    const nombre = e.target.nombre.value;
    const apellido = e.target.apellido.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    let message = '';

    // Validación de contraseñas
    if (password && password !== confirmPassword) {
        message = 'Las contraseñas no coinciden.';
    } else {
        // Si las contraseñas coinciden, realizamos la solicitud PUT al servidor
        const data = { nombre, apellido, email };  // Incluir el apellido en los datos a enviar
        if (password) data.password = password; // Solo enviar la nueva contraseña si fue proporcionada

        // Petición PUT a la API para actualizar los datos del usuario
        try {
            const response = await fetch('http://127.0.0.1:3000/usuarios/${id}', {  // Asumiendo que el ID del usuario es '1'
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            message = result.message || 'Datos actualizados exitosamente.';
        } catch (error) {
            message = 'Hubo un error al actualizar los datos. Inténtalo de nuevo.';
            console.error('Error al actualizar datos:', error);
        }
    }

    document.getElementById('updateMessage').innerHTML = message;  // Mostrar el mensaje al usuario
});
