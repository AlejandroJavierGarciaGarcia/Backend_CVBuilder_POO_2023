const Usuarios = require("../models/usuario.model");
const Formulario = require('../models/formulario.model');

async function registrarFormulario(req, res) {
    try {
        var parametros = req.body;

        if (parametros.idUsuario && parametros.resumenPerfil) {
            var formularioModel = new Formulario({
                idUsuario: parametros.idUsuario,
                resumenPerfil: parametros.resumenPerfil,
                idiomas: parametros.idiomas,
                educacion: parametros.educacion,
                certificaciones: parametros.certificaciones,
                experiencias: parametros.experiencias,
                habilidadesBlandas: parametros.habilidadesBlandas,
                habilidadesTecnicas: parametros.habilidadesTecnicas,
                redesSociales: parametros.redesSociales,
                referencias: parametros.referencias,
                estadoEmpleo: parametros.estadoEmpleo,
                proyectosRelevantes: parametros.proyectosRelevantes
            });

            // Guardar el nuevo formulario en la base de datos
            var formularioGuardado = await formularioModel.save();
            return res.status(200).send({ Formulario: formularioGuardado });
        } else {
            return res.status(500).send({ message: "Debe llenar todos los campos necesarios" });
        }
    } catch (err) {
        // Manejo de errores generales
        return res.status(500).send({ message: 'Error en la petición', error: err });
    }
}

async function SuscripcionNormal(req, res) {
  try {
      const userUpdate = await Usuarios.findOneAndUpdate(
          { _id: req.user.sub },
          { suscripcion: "Normal" },
          { new: true }
      );

      if (!userUpdate) {
          return res.status(404).send({ message: "Error al llevar a cabo la suscripción: Usuario no encontrado." });
      }

      return res.status(200).send({ Usuario: userUpdate });
  } catch (err) {
      return res.status(500).send({ message: "Error al llevar a cabo la suscripción", error: err.message });
  }
}


async function SuscripcionPremium(req, res) {
  try {
      const userUpdate = await Usuarios.findOneAndUpdate(
          { _id: req.user.sub },
          { suscripcion: "Premium" },
          { new: true }
      );

      if (!userUpdate) {
          return res.status(404).send({ message: "Error al llevar a cabo la suscripción: Usuario no encontrado." });
      }

      return res.status(200).send({ Usuario: userUpdate });
  } catch (err) {
      return res.status(500).send({ message: "Error al llevar a cabo la suscripción", error: err.message });
  }
}


module.exports = {
SuscripcionNormal,
SuscripcionPremium
};
