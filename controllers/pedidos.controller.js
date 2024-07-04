import pool from '../backend/config/db.js'
import jwt from 'jsonwebtoken'

/* CRUD Pedidos */
const nuevoPedido = async (req, res) => {
    
    const token = req.params.token;

    const producto = req.body;

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {

            return res
                .status(500)
                .send({"message": "token invalido"})

        } else {
            const id = decoded.id;

            const queryPedidos = `INSERT INTO pedidos SET ?`;
            const queryDetalle = `INSERT INTO detalle_pedido SET ?`;
            const queryProductos = `INSERT INTO productos_pedidos SET ?`;

            try {

                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');

                var pedido = {
                    "id_cliente": id,
                    "fecha_pedido": `${year}-${month}-${day}`,
                    "id_detalle": null
                }

                const connection = await pool.getConnection();
                const [resPedido] = await connection.query(queryPedidos, [pedido])
                const pedido_id = resPedido.insertId;
        
                var detalle = {
                    "id_pedido": pedido_id,
                    "detalles": ""
                }
                const [resDetalle] = await connection.query(queryDetalle, [detalle])
                const detalle_id = resDetalle.insertId;
        
                const queryUpdatePedido = `UPDATE pedidos SET id_detalle = ? WHERE id = ?`
                connection.query(queryUpdatePedido, [detalle_id, pedido_id])

                const productoInsertado = {
                    ...producto,
                    "id_detalle": detalle_id
                };
                await connection.query(queryProductos, [productoInsertado]);

                connection.release();
        
                res.send("pedido generado")
                
            } catch (error) {
                res.status(500).send(error)
            }
        }
        
    })
}

const actualizarPedido = async (req, res) => {

    const token = req.params.token;

    const producto = req.body;

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {

            return res
                .status(500)
                .send({"message": "token invalido"})

        } else {
            const id = decoded.id;

            const queryProductoExistente = `SELECT * FROM productos_pedidos WHERE id_producto = ?`

            try {

                const connection = await pool.getConnection();

                const [resExiste] = await connection.query(queryProductoExistente, [producto.id_producto])

                connection.release();

                if (resExiste.length > 0) {

                    const nueva_cantidad = +resExiste[0].cantidad + +producto.cantidad;
                    const nuevo_precio_parcial = +resExiste[0].precio_parcial + +producto.precio_parcial

                    const productoActualizado = {

                        "cantidad": nueva_cantidad,
                        "precio_parcial": nuevo_precio_parcial

                    }

                    const queryActualizarProducto = `UPDATE productos_pedidos SET cantidad = ?, precio_parcial = ? WHERE id_producto = ?`

                    try {
                        const connection = await pool.getConnection();

                        const [resActu] = await connection.query(queryActualizarProducto, [productoActualizado.cantidad, productoActualizado.precio_parcial, producto.id_producto])

                        connection.release();

                        res.status(200).send({"message": "pedido actualizado"});

                    } catch (error) {

                        res.status(500).send(error)

                    } 

                } else {

                    const queryNuevoProductoPedido = `INSERT INTO productos_pedidos SET ?`

                    try {

                        const connection = await pool.getConnection();

                        const [resNuevoProducto] = await connection.query(queryNuevoProductoPedido, [producto])

                        connection.release();

                        res.status(200).send({"message": "pedido actualizado"});


                        
                    } catch (error) {

                        res.status(500).send(error)
                        
                    }

                }
                
            } catch (error) {
                res.status(500).send(error)
            }
        }
        
    })

}

const tienePedido = async (req, res) => {
    const token = req.params.token;

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {

            return res
                .status(500)
                .send({"message": "token invalido"})

        } else {
            const id = decoded.id;

            const query = `SELECT * FROM pedidos WHERE pedidos.id_cliente = ?`;

            try {
        
                const connection = await pool.getConnection();
                const [rows] = await connection.query(query, [id]);
                connection.release();
                
                if (rows.length > 0) {

                    res.json({"id_detalle": rows[0].id_detalle});

                } else {

                    res.status(404).send({"message": "no tiene pedido"})
                }
                
            } catch (error) {
                res.status(500).send(error)
            }
        }
        
    })
}

const obtenerPedido = async (req, res) => {

    const token = req.params.token;

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {

        if (error) {

            return res
                .status(500)
                .send({"message": "token invalido"})

        } else {

            const id = decoded.id;

            const queryObtenerDetalle = `SELECT id_detalle FROM pedidos WHERE id_cliente = ?`

            try {

                const connection = await pool.getConnection();
                const [rows] = await connection.query(queryObtenerDetalle, [id]);
                connection.release();

                const queryObtenerPoductos = `SELECT * FROM productos_pedidos WHERE id_detalle = ?`

                try {

                    const connection = await pool.getConnection();
                    const [productos_pedidos] = await connection.query(queryObtenerPoductos, [rows[0].id_detalle]);
                    connection.release();

                    const queryDatosFaltantesProductos = `SELECT categoria, nombre FROM productos WHERE id = ?`

                    const productosCompletos = await Promise.all(productos_pedidos.map(async (producto) => {

                        const connection = await pool.getConnection();
                        const [datosFaltantes] = await connection.query(queryDatosFaltantesProductos, [producto.id_producto]);
                        connection.release();
                        return {
                            ...producto,
                            "categoria": datosFaltantes[0].categoria,
                            "nombre": datosFaltantes[0].nombre
                        };

                    }));


                    res.json(productosCompletos)
                    
                } catch (error) {
                    res.status(500).send(error)
                }
                
            } catch (error) {
                res.status(500).send(error)
            }

        }
    })
}

export default {
    tienePedido,
    nuevoPedido,
    actualizarPedido,
    obtenerPedido
};