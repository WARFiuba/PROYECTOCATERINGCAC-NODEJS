document.addEventListener('DOMContentLoaded', () => {

    const pedido = document.querySelector('.pedido')

    const token = localStorage.getItem('token')

    fetch(`http://localhost:3000/pedido/${token}`)
        .then(response => response.json())
        .then(data => {

            data.forEach(producto => {

                const articulo = document.createElement('article')
                var nombre = producto.nombre
                var categoria = producto.categoria
                var cantidad = producto.cantidad
                var precio = producto.precio_parcial

                articulo.innerHTML = `
                <p>${nombre}</p>
                <p>categoria:<br>${categoria}</p>
                <p>cantidad:<br>${cantidad}</p>
                <p>precio:<br>$${precio}</p>
                `;
                pedido.appendChild(articulo);
                
            });

            /*pedido.innerHTML += `
            <h3>${data.nombre}</h3>
            <h3>${data.email}</h3>
            <button>cambiar contraseña</button>
            `*/
        })
        .catch(error => console.error('Error fetching data:', error));
});