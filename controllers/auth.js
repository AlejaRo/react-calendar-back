const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, resp = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email }); // Hace búsqueda en la colección para ver si el usuario existe

    if (usuario) {
      // Si el usuario existe, retorna un error con status 400
      return resp.status(400).json({
        ok: false,
        message: 'El usuario ya existe',
      });
    }

    usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync(); // Genera un salt para la contraseña
    usuario.password = bcrypt.hashSync(password, salt); // Encripta la contraseña

    // Guardar usuario
    await usuario.save();

    // Generar JWT (Json Web Token)
    const token = await generarJWT(usuario.id, usuario.name);

    // Response
    resp.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);

    resp.status(500).json({
      ok: false,
      message: 'Por favor contactar con el administrador',
    });
  }
};

const login = async (req, resp = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // Si el usuario no existe, retorna un error con status 400
      return resp.status(400).json({
        ok: false,
        message: 'Usuario no registrado',
      });
    }

    // Confirmar password
    const validPassword = bcrypt.compareSync(password, usuario.password); // Compara la contraseña enviada con la que está almacenada en BBDD

    if (!validPassword) {
      return resp.status(400).json({
        ok: false,
        message: 'Password incorrecto',
      });
    }

    // Generar JWT (Json Web Token)
    const token = await generarJWT(usuario.id, usuario.name);

    // Response
    resp.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);

    resp.status(500).json({
      ok: false,
      message: 'Por favor contactar con el administrador',
    });
  }
};

const revalidarToken = async (req, resp = response) => {
  const { uid, name } = req;

  // Generar un nuevo JWT
  const token = await generarJWT(uid, name);

  // Response
  resp.json({
    ok: true,
    uid,
    name,
    token
  });
};

module.exports = {
  crearUsuario,
  login,
  revalidarToken,
};
