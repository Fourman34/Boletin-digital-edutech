document.addEventListener("DOMContentLoaded", () => {
    const formRegister = document.getElementById('createAccountForm');

    if (!formRegister) {
        console.error("No se encontró el formulario en el DOM.");
        return;
    }

    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dni = e.target.dni.value;
        const nombre = e.target.nombre.value;
        const apellido = e.target.apellido.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        const ID_rol = e.target.rol.value;  // Obtener el valor del campo de selección de rol

        const msgContainer = document.getElementById('message');

        // Validación de contraseñas
        if (password !== confirmPassword) {
            msgContainer.innerText = 'Las contraseñas no coinciden.';
            msgContainer.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/user', {
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
                    ID_rol,  // Enviar el rol seleccionado
                }),
            });

            const data = await response.json();

            if (response.ok) {
                msgContainer.innerText = 'Cuenta creada exitosamente.';
                msgContainer.style.color = 'green';

                // Redirigir a success.html después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'success.html';
                }, 2000);
            } else {
                msgContainer.innerText = data.message || 'Hubo un error al crear la cuenta.';
                msgContainer.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            msgContainer.innerText = 'Hubo un error al procesar el registro.';
            msgContainer.style.color = 'red';
        }
    });
});