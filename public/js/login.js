document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        console.log('Formulario enviado');

        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');

        console.log('Usuario:', username);
        console.log('Contraseña:', password);
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Usuario o contraseña incorrectos');
            }

            const data = await response.json();
            console.log('Token JWT:', data.token);
            localStorage.setItem('token', data.token);
            window.location.href = '/'
        } catch (error) {
            console.error('Error en la autenticación:', error.message);
        }
    });
});