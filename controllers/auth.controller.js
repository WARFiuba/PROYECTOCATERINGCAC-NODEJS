import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pool from '../backend/config/db.js'

/* CRUD usuarios */

const getDatosUsuario = async (req, res) => {
    const token = req.params.token;

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {

            return res
                .status(500)
                .send({"message": "token invalido"})

        } else {
            const id = decoded.id;

            const query = `SELECT * FROM usuarios WHERE usuarios.id = ?`;

            try {
        
                const connection = await pool.getConnection();
                const [rows] = await connection.query(query, [id]);
                connection.release();
                res.json({"username": rows[0].username, "email": rows[0].email});
                
            } catch (error) {
                res.status(500).send('internal server error')
            }
        }
        
    })
}

const registro = async (req, res) => {
    const usuario = req.body;

    const userQuery = `SELECT username FROM usuarios WHERE username = ?`;

    try {

        const connection = await pool.getConnection();
        const [userRow] = await connection.query(userQuery, [usuario.username]);
        if (userRow.length > 0) {
            res.status(409).send('nombre de usuario ya en uso')
        } else {

            const query = `INSERT INTO usuarios SET ?`;

            const passhash = await bcrypt.hash(usuario.password, 8);

            const usuarioSeguro = {
                'username': usuario.username,
                'email': usuario.email,
                'password': passhash
            }
            

            try {
        
                const [rows] = await connection.query(query, [usuarioSeguro]);
                connection.release();
                res.status(201).send({"message": `usuario creado con id: ${rows.insertId}`});
                
            } catch (error) {
                res.status(500).send(error);
            }

        }
        
    } catch (error) {
        res.status(500).send(error);
    }
    
}

const cambiarContrasenia = async (req, res) => {
    const id = req.params.id;
    const usuario = req.body;
    const queryCheck = `SELECT password FROM usuarios WHERE id = ?`;
    const query = `UPDATE usuarios SET ? WHERE id = ?`;

    try {
        const connection = await pool.getConnection();
        const [row] = await connection.query(queryCheck, [id]);
        connection.release();

        if ((await bcrypt.compare(usuario.currentPassword, row[0].password))) {

            try {
                const passhash = await bcrypt.hash(usuario.newPassword, 8);
                const password ={"password": passhash};
                const connection = await pool.getConnection();
                const [row] = await connection.query(query, [password, id]);
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
}

const login = async (req, res) => {
    const body = req.body;

    const query = `SELECT * FROM usuarios WHERE username = ?`;

    try {

        const connection = await pool.getConnection();
        const [row] = await connection.query(query, [body.username])
        connection.release();

        if (row[0].length == 0 || !(await bcrypt.compare(body.password, row[0].password))) {
            res.status(401).send({"message": 'usuaio o contraseña incorrectos'});
        } else {

            const id = row[0].id;
            const token = jwt.sign({id:id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE_TIME})

            res.send({ token })
        }

    } catch (error) {
        throw error;
    }
}

const verificarToken = async (req, res) => {
    const token = req.params.token;

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {

            return res
                .status(500)
                .send({"message": "token invalido"})

        } else {
            
            res.status(200).send({"message": "token valido"})
        }
    })

}

export default {
    getDatosUsuario,
    registro,
    cambiarContrasenia,
    login,
    verificarToken
};