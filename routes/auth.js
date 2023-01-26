/*
  Rutas de usuarios
  host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { crearUsuario, login, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
  '/new',
  [
    // Middlewares
    // Validaciones
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({
      min: 6,
    }),

    // Validador de campos
    validarCampos,
  ],
  crearUsuario
);

router.post(
  '/',
  [
    // Middlewares
    // Validaciones
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({
      min: 6,
    }),

    // Validador de campos
    validarCampos,
  ],
  login
);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;
