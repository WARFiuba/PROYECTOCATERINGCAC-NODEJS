document.addEventListener('DOMContentLoaded', () => {

    const pedido = document.querySelector('.datos')

    const token = localStorage.getItem('token')

    fetch(`http://localhost:3000/datos/${token}`)
        .then(response => response.json())
        .then(data => {
            pedido.innerHTML += `
            <h3>${data.nombre}</h3>
            <h3>${data.email}</h3>
            <button>cambiar contraseña</button>
            `
        })
        .catch(error => console.error('Error fetching data:', error));
});