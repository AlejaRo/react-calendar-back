/*
  Eventos
  host + /api/events

  Deben pasar por la validación del token
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.use(validarJWT); // A partir de acá, todas las rutas serán validadas contra el JWT

// Obtener eventos
router.get('/', getEventos);

// Crear un nuevo evento
router.post(
  '/',
  [
    check('title', 'El título es requerido').not().isEmpty(),
    check('start', 'La fecha de inicio es requerida').custom(isDate),
    check('end', 'La fecha de fin es requerida').custom(isDate),
    validarCampos,
  ],
  crearEvento
);

// Crear un nuevo evento
router.put(
  '/:id',
  [
    check('title', 'El título es requerido').not().isEmpty(),
    check('start', 'La fecha de inicio es requerida').custom(isDate),
    check('end', 'La fecha de fin es requerida').custom(isDate),
    validarCampos,
  ],
  actualizarEvento
);

// Borrar evento
router.delete('/:id', eliminarEvento);

module.exports = router;
