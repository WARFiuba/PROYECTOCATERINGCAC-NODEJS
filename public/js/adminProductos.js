fetch('http://localhost:3000/productos')
    .then(response => response.json())
    .then(data => {
        const productos = data;
        const contenedorProductos = document.querySelector(".listadoProductos")
        productos.forEach(producto => {
            const productoArticulo = document.createElement('article');
            productoArticulo.innerHTML = `
            <h3>${producto.nombre}</h3>
            <h3>${producto.categoria}</h3>
            <h3>${producto.stock}</h3>
            <h3>${producto.precio}</h3>
            <button class="btn-edit" value="${producto.id}"> editar </button>
            <button class="btn-delete" value="${producto.id}"> borrar </button>
            `;
            contenedorProductos.appendChild(productoArticulo);
        });
        const openModalEdit = document.querySelectorAll(".btn-edit")
        const openModalDelete = document.querySelectorAll(".btn-delete")
        openModalEdit.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log(btn.value);
            })
        })
    })
