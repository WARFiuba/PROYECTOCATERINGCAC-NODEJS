document.addEventListener('DOMContentLoaded', () => {

    const login = document.querySelector('.login')
    const perfil = document.querySelector('.perfil')
    const logout = document.querySelector('.logout')

    const token = localStorage.getItem('token');

    if (token) {

        login.style.display = 'none';
        perfil.style.display = 'block';
        logout.style.display = 'block';
        
    } else {

        login.style.display = 'block';
        perfil.style.display = 'none';
        logout.style.display = 'none';
        
    }
});