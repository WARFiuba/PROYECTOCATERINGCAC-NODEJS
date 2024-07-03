import pool from '../backend/config/db.js'
import jwt from 'jsonwebtoken'

/* CRUD Pedidos */

/* posiblemente necesario

    const productos = req.body.productos;
    let pedido = req.body.pedido;
    let detalle = req.body.detalle;

    pedido = { ...pedido,
                "id_cliente": +id_cliente,
                "id_detalle": null
    }
*/

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

            const queryProductos = `INSERT INTO productos_pedidos SET ?`;

            try {

        

                connection.release();
        
                res.send("pedido generado")
                
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

                    res.json({"message": "tiene pedido", "id_detalle": rows[0].id_detalle});

                } else {

                    res.status(404).send({"message": "no tiene pedido"})
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
    actualizarPedido
};