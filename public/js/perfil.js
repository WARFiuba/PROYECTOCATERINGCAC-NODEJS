document.addEventListener('DOMContentLoaded', () => {

    const datos = document.querySelector('.datos')

    const token = localStorage.getItem('token')

    fetch(`http://localhost:3000/datos/${token}`)
        .then(response => response.json())
        .then(data => {
            datos.innerHTML += `
            <h3>${data.username}</h3>
            <h3>${data.email}</h3>
            <button>cambiar contraseña</button>
            `
        })
        .catch(error => console.error('Error fetching data:', error));
});