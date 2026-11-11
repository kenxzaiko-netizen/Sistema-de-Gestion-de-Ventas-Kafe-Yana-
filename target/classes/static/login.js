document.querySelector('#login-form').addEventListener('submit', function (evento) {
    evento.preventDefault();
    document.querySelector('#login-aviso').textContent = 'El inicio de sesión aún no está conectado. Puedes continuar como invitado.';
});
