document.addEventListener('DOMContentLoaded', () => {

    const productos = document.querySelectorAll('.producto');

    productos.forEach(producto => {
        producto.addEventListener('click', () => {
            window.location.href= `/producto/${producto.dataset.categoria}`
        })
    })

    function fetchData(categoria) {
        fetch(`http://localhost:3000/productos/${encodeURIComponent(categoria)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Data from backend:', data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
});