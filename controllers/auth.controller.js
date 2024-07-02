import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pool from '../backend/config/db.js'

/* CRUD usuarios */

const getDatosUsuario = async (req, res) => {
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
}

const registro = async (req, res) => {
    const usuario = req.body;

    const userQuery = `SELECT username FROM usuarios WHERE username = ?`;

    try {

        const connection = await pool.getConnection();
        const [userRow] = await connection.query(userQuery, [usuario.username]);
        console.log(userRow);
        if (userRow.length > 0) {
            res.status(409).send('nombre de usuario ya en uso')
        } else {

            const query = `INSERT INTO usuarios SET ?`;

            try {
        
                const [rows] = await connection.query(query, [usuario]);
                connection.release();
                res.status(201).send(`usuario creado con id: ${rows.insertId}`);
                
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
}

const login = async (req, res) => {
    const body = req.body;

    const userQuery = `SELECT username FROM usuarios WHERE username = ?`;
    const passQuery = `SELECT password FROM usuarios WHERE password = ?`;

    try {

        const connection = await pool.getConnection();
        const [rowUser] = await connection.query(userQuery, [body.username]);
        const [rowPass] = await connection.query(passQuery, [body.password]);
        connection.release();
        
    } catch (error) {
        res.status(500).send('internal server error')
    }
}

export default {
    getDatosUsuario,
    registro,
    cambiarContrasenia,
    login
};