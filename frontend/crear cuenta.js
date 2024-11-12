const formRegister = document.getElementById('createAccountForm');

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dni = e.target.dni.value;
    const nombre = e.target.nombre.value;
    const apellido = e.target.apellido.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const ID_rol = 2;  // Si deseas asignar un rol fijo para este formulario

    let message = '';

    // Validación de contraseñas
    if (password !== confirmPassword) {
        message = 'Las contraseñas no coinciden.';
    } else {
        // Solicitud POST al servidor
        await fetch('http://127.0.0.1:3000/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dni,
                nombre,
                apellido,
                email,
                password,
                ID_rol,
            }),
        })
        .then(response => response.json())
        .then(data => {
            message = data.message || 'Cuenta creada exitosamente.';
        })
        .catch((error) => {
            message = 'Hubo un error al procesar el registro.';
            console.error('Error:', error);
        });
    }

    // Mostrar mensaje en la interfaz
    const msgContainer = document.getElementById('message');
    msgContainer.innerText = message;
});
