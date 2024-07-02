import express from 'express'

import usuario  from '../controllers/auth.controller.js'

const router = express.Router();

//vista

//back
router.get('/datos/:id', usuario.getDatosUsuario);

router.post('/registro', usuario.registro);

router.put('/changePassword/:id', usuario.cambiarContrasenia);

router.post('/login', usuario.login);

export default router