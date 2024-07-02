import pool from '../backend/config/db.js'

/* CRUD Pedidos */

app.post('/pedidos/nuevo/:id_cliente', async (req, res) => {
    const id_cliente = req.params.id_cliente;

    const productos = req.body.productos;
    let pedido = req.body.pedido;
    let detalle = req.body.detalle;

    pedido = { ...pedido,
                "id_cliente": +id_cliente,
                "id_detalle": null
    }

    const queryPedidos = `INSERT INTO pedidos SET ?`;
    const queryDetalle = `INSERT INTO detalle_pedido SET ?`;
    const queryProductos = `INSERT INTO productos_pedidos SET ?`;

    try {
        
        const connection = await pool.getConnection();
        const [resPedido] = await connection.query(queryPedidos, [pedido])
        const pedido_id = resPedido.insertId;

        detalle = {
            ...detalle,
            "id_pedido": pedido_id
        }
        const [resDetalle] = await connection.query(queryDetalle, [detalle])
        const detalle_id = resDetalle.insertId;

        const queryUpdatePedido = `UPDATE pedidos SET id_detalle = ? WHERE id = ?`
        connection.query(queryUpdatePedido, [detalle_id, pedido_id])

        for (const producto of productos) {
            const productoInsertado = {
                ...producto,
                "id_detalle": detalle_id
            };
            await connection.query(queryProductos, [productoInsertado]);
        }
        connection.release();

        res.send("pedido generado")

    } catch (error) {
        res.status(500).send(error);
    }
})