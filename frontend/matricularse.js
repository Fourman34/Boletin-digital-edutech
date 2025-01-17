const formLogin = document.getElementById('loginForm'); // El formulario de inicio de sesión

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();  // Evitar el comportamiento predeterminado del formulario

  const email = e.target.email.value;
  const password = e.target.password.value;

  let message = '';

  // Realizamos la solicitud POST al servidor para autenticar al usuario
  await fetch('http://127.0.0.1:3306/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }), // Enviamos las credenciales
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        message = 'Inicio de sesión exitoso.';
        window.location.href = 'success.html'; // Redirigir a un dashboard u otra página de éxito
      } else {
        message = 'Correo o contraseña incorrectos.';
      }
    })
    .catch((error) => {
      message = 'Hubo un error al iniciar sesión. Inténtalo de nuevo.';
      console.error('Error al iniciar sesión:', error);
    });

  document.getElementById('loginMessage').innerHTML = message;  // Mostrar el mensaje al usuario
});
