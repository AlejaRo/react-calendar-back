const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, resp = response, next) => {
  const token = req.header('x-token'); // Token se envía en ítem x-token en los headers

  if (!token) {
    return resp.status(401).json({
      ok: false,
      message: 'No hay token en la petición',
    });
  }

  try {
    // Tomar uid y name de la respuesta del verify
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req.uid = uid;
    req.name = name;
  } catch (error) {
    console.log('Error al validar el token:', error);
    return resp.status(401).json({
      ok: false,
      message: 'Token inválido',
    });
  }

  next();
};

module.exports = {
  validarJWT,
};
