const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name };

    jwt.sign(
      payload, // Lo que se envía
      process.env.SECRET_JWT_SEED, // Una palabra o frase secreta
      {
        expiresIn: '2h', // Tiempo de expiración
      },
      (err, token) => {
        if (err) {
          console.log('Error token:', err);
          reject(err);
        }

        resolve(token);
      }
    );
  });
};

module.exports = {
  generarJWT,
};
