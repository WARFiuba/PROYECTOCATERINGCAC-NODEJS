import express from 'express'

import usuario  from '../controllers/auth.controller.js'
import productos from '../controllers/productos.controller.js'

const router = express.Router();

router.get('/datos/:id', usuario.getDatosUsuario);

router.post('/registro', usuario.registro);

router.put('/changePassword/:id', usuario.cambiarContrasenia);

router.post('/login', usuario.login);

router.get('/productos/:categoria', productos.obtenerProducto)

export default router