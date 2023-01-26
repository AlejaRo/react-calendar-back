const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, resp = response) => {
  const eventos = await Evento.find().populate('user', 'name'); // Con populate se especifica qué campos de user se quieren obtener. Los campos se pasan como segundo parámetro, separados por un espacio.

  try {
    resp.json({
      ok: true,
      eventos,
    });
  } catch (error) {
    console.log(error);

    resp.status(500).json({
      ok: false,
      message: 'Por favor contactar con el administrador',
    });
  }
};

const crearEvento = async (req, resp = response) => {
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    const eventSaved = await evento.save();

    resp.json({
      ok: true,
      evento: eventSaved,
    });
  } catch (error) {
    console.log(error);

    resp.status(500).json({
      ok: false,
      message: 'Por favor contactar con el administrador',
    });
  }
};

const actualizarEvento = async (req, resp = response) => {
  const eventoId = req.params.id;
  const { uid } = req;

  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return resp.status(404).json({
        ok: false,
        message: 'Evento no existe',
      });
    }

    if (evento.user.toString() !== uid) {
      return resp.status(401).json({
        ok: false,
        message: 'No permitido ya que el usuario no es autor de esta nota',
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true } // Esto hace que se muestre la nueva data ya que por defecto retorna la anterior
    );

    resp.json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);

    resp.status(500).json({
      ok: false,
      message: 'Por favor contactar con el administrador',
    });
  }
};

const eliminarEvento = async (req, resp = response) => {
  const eventoId = req.params.id;
  const { uid } = req;

  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return resp.status(404).json({
        ok: false,
        message: 'Evento no existe',
      });
    }

    if (evento.user.toString() !== uid) {
      return resp.status(401).json({
        ok: false,
        message: 'No permitido ya que el usuario no es autor de esta nota',
      });
    }

    await Evento.findByIdAndDelete(eventoId);

    resp.json({
      ok: true,
      message: 'Evento eliminado',
    });
  } catch (error) {
    console.log(error);

    resp.status(500).json({
      ok: false,
      message: 'Por favor contactar con el administrador',
    });
  }
};

module.exports = { getEventos, crearEvento, actualizarEvento, eliminarEvento };
