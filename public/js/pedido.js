document.addEventListener('DOMContentLoaded', () => {

    const botones = document.querySelectorAll('.btn-agregar')


    const token = localStorage.getItem('token')

    botones.forEach( boton => {
        boton.addEventListener('click', async () => {

            const precio = boton.dataset.precio;

            const id_producto = boton.dataset.id;
            const cantidad = 1 //cambiar por cantidad variable mas adelante
            const precio_parcial = cantidad * precio;


            const response = await fetch(`http://localhost:3000/tienePedido/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok){

                await fetch(`http://localhost:3000/pedidos/nuevo/${token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id_producto, cantidad, precio_parcial}),
                })
                
            } else {

            }

        })
    })

})