const formLogin = document.getElementById('loginForm'); // Captura el formulario

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que la página se recargue automáticamente

  const email = e.target.email.value;
  const password = e.target.password.value;

  const response = await fetch('http://127.0.0.1:5500/frontend/matricularse.html', { // Enviar datos al backend
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }), // Enviar credenciales
  });

  const data = await response.json(); // Convertir respuesta en JSON

  if (data.success) {
    alert('Inicio de sesión exitoso.');
    window.location.href = 'success.html'; // Redirigir al usuario
  } else {
    document.getElementById('loginMessage').innerText = 'Correo o contraseña incorrectos.';
  }
});