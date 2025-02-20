document.addEventListener("DOMContentLoaded", () => {
    const formRegister = document.getElementById('createAccountForm');
    const cursoSelect = document.getElementById('cursoSelect'); // Campo de curso
    const rolSelect = document.getElementById('rolSelect'); // Campo de rol
    const msgContainer = document.getElementById('message');

    if (!formRegister) {
        console.error("No se encontró el formulario en el DOM.");
        return;
    }

    // Escuchar cambios en el campo de rol
    rolSelect.addEventListener('change', (e) => {
        const selectedRol = e.target.value;

        // Deshabilitar el campo de curso si el rol es "Gestor de notas" (ID_rol = 2)
        if (selectedRol === "2") {
            cursoSelect.disabled = true;
            cursoSelect.value = ""; // Limpiar el valor seleccionado
        } else {
            cursoSelect.disabled = false;
        }
    });

    // Manejar el envío del formulario
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dni = e.target.dni.value.trim();
        const nombre = e.target.nombre.value.trim();
        const apellido = e.target.apellido.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        const ID_rol = e.target.rol.value;  // Obtener el valor del campo de selección de rol
        const curso = ID_rol === "2" ? null : e.target.curso.value; // Ignorar curso si el rol es "Gestor de notas"

        // Validación de campos obligatorios
        if (!dni || !nombre || !apellido || !email || !password || !confirmPassword || !ID_rol) {
            msgContainer.innerText = 'Todos los campos son obligatorios.';
            msgContainer.style.color = 'red';
            return;
        }

        // Validación de formato de DNI (solo números)
        if (!/^\d+$/.test(dni)) {
            msgContainer.innerText = 'El DNI debe contener solo números.';
            msgContainer.style.color = 'red';
            return;
        }

        // Validación de contraseñas
        if (password !== confirmPassword) {
            msgContainer.innerText = 'Las contraseñas no coinciden.';
            msgContainer.style.color = 'red';
            return;
        }

        // Validación de formato de email
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            msgContainer.innerText = 'El formato de email no es válido.';
            msgContainer.style.color = 'red';
            return;
        }

        // Deshabilitar el botón de envío y mostrar un indicador de carga
        const submitButton = formRegister.querySelector('input[type="submit"]');
        submitButton.disabled = true;
        submitButton.value = "Creando cuenta...";

        try {
            // Mostrar los datos antes de enviarlos para depuración
            console.log("Datos enviados:", {
                dni,
                nombre,
                apellido,
                email,
                password,
                ID_rol,
                curso,
            });

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
                    password, // Asegúrate de encriptar la contraseña en el backend si no lo estás haciendo aquí
                    ID_rol,  // Enviar el rol seleccionado
                    curso,   // Enviar el curso seleccionado (puede ser null)
                }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Leer el mensaje de error del backend
                throw new Error(errorData.message || `Error en la solicitud: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            msgContainer.innerText = 'Cuenta creada exitosamente.';
            msgContainer.style.color = 'green';

            // Redirigir a success.html después de 2 segundos
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 2000);
        } catch (error) {
            console.error('Error:', error);

            // Mostrar detalles del error para depuración
            msgContainer.innerText = error.message || 'Hubo un error al procesar el registro. Verifica tu conexión a internet o intenta nuevamente.';
            msgContainer.style.color = 'red';

            // Agregar detalles del error del servidor
            if (error.response) {
                const errorDetails = await error.response.text();  // Leemos la respuesta de error en texto
                console.error('Detalles del error del servidor:', errorDetails);
            }
        } finally {
            submitButton.disabled = false;
            submitButton.value = "Crear Cuenta";
        }
    });
});
