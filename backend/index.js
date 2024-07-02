import express from 'express'
import pool from "./config/db.js";
import cors from 'cors'

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

/* CRUD usuarios */

app.get('/datos/:id', async (req, res) => {
    const id = req.params.id;
    const query = `SELECT usuarios.username, usuarios.email FROM usuarios WHERE usuarios.id = ?`;

    try {

        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, [id]);
        connection.release();
        res.json(rows);
        
    } catch (error) {
        res.status(500).send('internal server error')
    }
})

app.post('/registro', async (req, res) => {
    const usuario = req.body;

    const query = `INSERT INTO usuarios SET ?`

    try {

        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, [usuario]);
        connection.release();
        res.send(`usuario creado con id: ${rows.insertId}`);
        
    } catch (error) {
        res.status(500).send('internal server error')
    }
})

app.put('/changePassword/:id', async (req, res) => {
    const id = req.params.id;
    const producto = req.body;
    const queryCheck = `SELECT password FROM usuarios WHERE id = ?`;
    const query = `UPDATE usuarios SET ? WHERE id = ?`;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(queryCheck, [id]);
        connection.release();

        if (producto.currentPassword == rows[0].password) {

            try {
                const password ={"password": producto.newPassword};
                const connection = await pool.getConnection();
                const [rows] = await connection.query(query, [password, id]);
                connection.release();
                res.send(`usuario actualizado con id: ${id}`);
                
            } catch (error) {
                res.status(500).send('internal server error');
            }
    
        } else {
    
            res.status(401).send('passwords do not match');
    
        }

    } catch (error) {
        res.status(500).send('internal server error');
    }
})

/* CRUD Productos */
app.get('/productos', async (req, res) => {
    const query = `SELECT * FROM productos`
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query);
        connection.release();
        res.json(rows)
    } catch (error) {
        res.status(500).send('internal server error');
    }
})

app.get('/producto/:categoria', async (req, res) => {
    const categoria = req.params.categoria;
    const query = `SELECT productos.nombre, productos.stock, productos.precio FROM productos WHERE productos.categoria = ?`;

    try {

        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, [categoria]);
        connection.release();
        res.json(rows);
        
    } catch (error) {
        res.status(500).send('internal server error');
    }
})

app.post('/productos', async (req, res) => {

    const producto = req.body;

    const query = `INSERT INTO productos SET ?`

    try {

        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, [producto]);
        connection.release();
        res.send(`producto creado con id: ${rows.insertId}`);
        
    } catch (error) {
        res.status(500).send('internal server error');
    }
})

app.put('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const producto = req.body;

    const query = `UPDATE productos SET ? WHERE id = ?`;

    try {

        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, [producto, id]);
        connection.release();
        res.send(`producto actualizado con id: ${id}`);
        
    } catch (error) {
        res.status(500).send('internal server error');
    }
})

app.delete('/productos/:id', async (req, res) => {
    const id = req.params.id;

    const query = `DELETE FROM productos WHERE id = ?`;

    try {

        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, [id]);
        connection.release();
        res.send(`producto borrado con id: ${id}`);
        
    } catch (error) {
        res.status(500).send('internal server error');
    }
})

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

const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
