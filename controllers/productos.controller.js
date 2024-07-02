import pool from '../backend/config/db.js'

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