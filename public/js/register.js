document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('register-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        console.log('Formulario enviado');

        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const email = formData.get('email')
        const password = formData.get('password');

        console.log('Usuario:', username);
        console.log('email:', email);
        console.log('Contraseña:', password);
        try {
            const response = await fetch('http://localhost:3000/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                throw new Error('Usuario ya en uso');
            }

            const data = await response.json();
            console.log(data);
            window.location.href = '/login'
        } catch (error) {
            console.error('Error al registrarse:', error.message);
        }
    });
});