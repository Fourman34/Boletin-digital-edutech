const formLogin = document.getElementById('loginForm'); // Captura el formulario

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que la página se recargue automáticamente

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const response = await fetch('http://localhost:3000/api/login', { // Ajusta la URL a tu backend real
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Enviar credenciales
    });

    // Verificar si la respuesta es válida antes de convertirla en JSON
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json(); // Convertir respuesta en JSON
    console.log('Respuesta del servidor:', data); // <-- Depuración

    if (data.success) {
      alert('Inicio de sesión exitoso.');

      // Guardar la sesión del usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redirigir a la página principal del usuario
      window.location.href = 'success.html';
    } else {
      document.getElementById('loginMessage').innerText = 'Correo o contraseña incorrectos.';
    }
  } catch (error) {
    console.error('Error en la autenticación:', error);
    document.getElementById('loginMessage').innerText = 'Ocurrió un error. Inténtalo de nuevo.';
  }
});
