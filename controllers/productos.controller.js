import pool from '../backend/config/db.js'

/* CRUD Productos */
const obtenerProductos = async (req, res) => {
    const query = `SELECT * FROM productos`
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query);
        connection.release();
        res.json(rows)
    } catch (error) {
        res.status(500).send('internal server error');
    }
}

const obtenerProducto = async (req, res) => {
    const {categoria} = req.params;
    const query = `SELECT * FROM productos WHERE productos.categoria = ?`;

    try {

        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, [categoria]);
        connection.release();
        res.json(rows);
        
    } catch (error) {
        res.status(500).send('internal server error');
    }
}

const agregarProducto = async (req, res) => {

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
}

const actualizarProducto = async (req, res) => {
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
}

const eliminarProducto = async (req, res) => {
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
}

export default {
    obtenerProductos,
    obtenerProducto,
    agregarProducto,
    actualizarProducto,
    eliminarProducto
};