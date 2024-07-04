import express from 'express'

import usuario  from '../controllers/auth.controller.js'
import productos from '../controllers/productos.controller.js'
import pedidos from '../controllers/pedidos.controller.js'

const router = express.Router();

router.get('/datos/:token', usuario.getDatosUsuario);

router.post('/registro', usuario.registro);

router.put('/changePassword/:id', usuario.cambiarContrasenia);

router.post('/login', usuario.login);

router.get('/productos/:categoria', productos.obtenerProducto);

router.get('/tienePedido/:token', pedidos.tienePedido);

router.post('/pedidos/nuevo/:token', pedidos.nuevoPedido);

router.put('/pedidos/actualizar/:token', pedidos.actualizarPedido);

router.get('/pedido/:token', pedidos.obtenerPedido)

router.get('/verificarToken/:token', usuario.verificarToken)

export default router