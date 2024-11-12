const formUpdate = document.getElementById('updateForm'); // El formulario para actualizar datos

formUpdate.addEventListener('submit', async (e) => {
  e.preventDefault();  // Evitar el comportamiento predeterminado del formulario

  const nombre = e.target.nombre.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const confirmPassword = e.target.confirmPassword.value;

  let message = '';

  // Validación de contraseñas
  if (password && password !== confirmPassword) {
    message = 'Las contraseñas no coinciden.';
  } else {
    // Si las contraseñas coinciden, realizamos la solicitud PUT al servidor
    const data = { nombre, email };
    if (password) data.password = password; // Solo enviar la nueva contraseña si fue proporcionada

    await fetch('http://127.0.0.1:3000/actualizar-datos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        message = data.message || 'Datos actualizados exitosamente.';
      })
      .catch((error) => {
        message = 'Hubo un error al actualizar los datos. Inténtalo de nuevo.';
        console.error('Error al actualizar datos:', error);
      });
  }

  document.getElementById('updateMessage').innerHTML = message;  // Mostrar el mensaje al usuario
});
