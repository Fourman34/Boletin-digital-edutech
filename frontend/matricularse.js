document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById('loginForm');

  if (!formLogin) {
      console.error("No se encontró el formulario en el DOM.");
      return;
  }

  formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = e.target.email.value;
      const password = e.target.password.value;

      console.log("📤 Enviando datos al backend:", { email, password });

      try {
          const response = await fetch('http://localhost:3000', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });

          console.log("📥 Respuesta HTTP recibida:", response);

          if (!response.ok) {
              throw new Error(`Error HTTP: ${response.status}`);
          }

          const data = await response.json();
          console.log('📥 Respuesta del servidor:', data);

          if (data.success) {
              alert('✅ Inicio de sesión exitoso.');
              localStorage.setItem('usuario', JSON.stringify(data.usuario));
              window.location.href = 'success.html';
          } else {
              const messageElement = document.getElementById('loginMessage');
              if (messageElement) {
                  messageElement.innerText = '❌ Correo o contraseña incorrectos.';
              }
          }
      } catch (error) {
          console.error('❌ Error en la autenticación:', error);

          const messageElement = document.getElementById('loginMessage');
          if (messageElement) {
              messageElement.innerText = '⚠️ Ocurrió un error. Inténtalo de nuevo.';
          }
      }
  });
});
