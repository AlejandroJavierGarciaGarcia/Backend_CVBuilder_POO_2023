
/**
 * @author Ana Laura Tschen, Jonathan Zacarías, Alejandro García
 * @version 1.0
 * @date 18/09/2023
 * Comentado con IA
 */

const Recomendaciones = require("../models/recomendacion.model")

function obtenerRecomendaciones(req, res) {
    Recomendaciones.find().then(recomendacionEncontrada => {
      if (!recomendacionEncontrada || recomendacionEncontrada.length === 0) {
        return res.status(404).send({ message: "Actualmente no existen recomendaciones" });
      }
      return res.status(200).send({ Recomendaciones: recomendacionEncontrada });
    }).catch(err => {
      return res.status(500).send({
        message: "Ocurrió un error en la petición, inténtelo de nuevo más tarde",
        error: err
      });
    });
  }

  async function obtenerRecomendacionId(req, res) {
    try {
      var idRecomendacionParam = req.params.idRecomendacion;
      const recomendacionEncontrada = await Recomendaciones.findById(idRecomendacionParam);
      if (!recomendacionEncontrada) {
        return res.status(404).send({ message: "La recomendación no existe" });
      }
      return res.status(200).send({ Recomendaciones: recomendacionEncontrada });
    } catch (err) {
      return res.status(500).send({
        message: "Ocurrió un error en la petición, inténtelo de nuevo más tarde",
        error: err
      });
    }
  }
  
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * Método generado con IA por requerimientos de la entrega
 */
async function registrarRecomendacionIA(req, res) {
    try {
        var parametros = req.body;
        if (parametros.titulo && parametros.descripcion && parametros.tips && parametros.clasificacion) {
            var arregloTips = parametros.tips.split(", ");
            
            var ejercicioModel = new Recomendaciones({
                titulo: parametros.titulo,
                descripcion: parametros.descripcion,
                tips: arregloTips,
                clasificacion: parametros.clasificacion
            });

            // Verificar si ya existe una recomendación con el mismo título o descripción
            const tituloExistente = await Recomendaciones.findOne({ titulo: parametros.titulo });
            const descripcionExistente = await Recomendaciones.findOne({ descripcion: parametros.descripcion });

            if (tituloExistente) {
                return res.status(500).send({ message: 'La recomendación ya existe. Verifique los datos' });
            } else if (descripcionExistente) {
                return res.status(500).send({ message: 'La descripción ingresada ya existe. Verifique los datos.' });
            } else {
                // Guardar la nueva recomendación
                var recomendacionGuardada = await ejercicioModel.save();
                return res.status(200).send({ Recomendaciones: recomendacionGuardada });
            }
        } else {
            return res.status(500).send({ message: "Debe llenar los campos necesarios" });
        }
    } catch (err) {
        // Manejo de errores generales
        return res.status(500).send({ message: 'Error en la peticion' });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 * 
 * Método sin IA
 */
function registrarRecomendacion(req, res) {
if(req.user.rol != 'ROL_CLIENTE') return res.status(500).send({message: "Solo el rol Administrador puede registrar un articulo"})

  var parametros = req.body;
  var recomendacionModel = new Recomendaciones();
  if (
      parametros.titulo &&
      parametros.descripcion &&
      parametros.tips &&
      parametros.clasificacion) {
      var arregloTips = parametros.tips.split(", ");
      recomendacionModel.titulo = parametros.titulo;
      recomendacionModel.descripcion = parametros.descripcion;
      recomendacionModel.tips = parametros.arregloTips;
      recomendacionModel.clasificacion = parametros.clasificacion;

      Recomendaciones.findOne({ nombre: parametros.nombre }, (err, nombreEncontrado) => {
          Recomendaciones.findOne({ descripcion: parametros.descripcion }, (err, descripcionEncontrada) => {
              if (nombreEncontrado != null) {
                  return res.status(500).send({ message: 'La recomendación ya existe. Verifique los datos' })
              } else {
                  if (descripcionEncontrada != null) {
                      return res.status(500).send({ message: 'La descripción ingresada ya existe. Verifique los datos.' })
                  } else {
                      recomendacionModel.save((err, recomendacionGuardada) => {
                          console.log(err, recomendacionGuardada)
                          if (err) return res.status(500).send({ message: 'Error en la peticion' });
                          if (!recomendacionGuardada) return res.status(404).send({ message: 'No se han podido guardar los datos' });
                          return res.status(200).send({ Recomendaciones: recomendacionGuardada });
                      });
                  }
              }
          })
      });
  } else {
      return res
          .status(500)
          .send({ message: "Debe llenar los campos necesarios" });
  }
}


async function eliminarRecomendacion(req, res) {
    var idRecomendacionParam = req.params.idRecomendacion;

    try {
        const recomendacionEliminada = await Recomendaciones.findByIdAndDelete(idRecomendacionParam);

        if (!recomendacionEliminada) {
            return res.status(404).send({
                message: "No se encontró la recomendación para eliminar o ya fue eliminada previamente",
            });
        }

        return res.status(200).send({ Recomendaciones: recomendacionEliminada });
    } catch (err) {
        return res.status(500).send({
            message: "Ocurrió un error en la petición, inténtelo de nuevo más tarde",
        });
    }
}

/**
function editarEjercicio(req, res) {
  var idRecomendacionParam = req.params.idRecomendacion
  var parametros = req.body;
  Recomendaciones.findOne({ _id: idRecomendacionParam }, (err, recomendacionExistente) => {
      if (parametros.titulo || parametros.descripcion) {
          Recomendaciones.findOne({ nombre: parametros.titulo }, (err, recomendacionNoEncontrada) => {
              Recomendaciones.findOne({ descripcion: parametros.descripcion }, (err, DescripEncontrado) => {
                      if (recomendacionNoEncontrada != null && recomendacionExistente.titulo != parametros.titulo) {
                          return res.status(500).send({ message: 'El título ingresado ya existe. Verifique los datos' })
                      } else {
                          if (DescripEncontrado != null && recomendacionExistente.descripcion != parametros.descripcion) {
                              return res.status(500).send({ message: 'La descripcion ingresada ya existe. Verifique los datos.' })
                          } else {
                              Recomendaciones.findOneAndUpdate({ _id: recomendacionExistente._id }, parametros, { new: true }, (err, recomendacionesEditadas) => {
                                  if (err) return res.status(404).send({ message: "Error al editar el ejercicio" })
                                  if (!recomendacionesEditadas) return res.status(500).send({ message: "No puede editar este ejercicio" })
                                  return res.status(200).send({ Recomendaciones: recomendacionesEditadas });
                              });
                          }
                      }
          
              });

          });


      }
  })
}*/

async function editarRecomendacion(req, res) {
    try {
        var idRecomendacionParam = req.params.idRecomendacion;
        var parametros = req.body;

        const recomendacionExistente = await Recomendaciones.findById(idRecomendacionParam);
        if (!recomendacionExistente) {
            return res.status(404).send({ message: "Recomendación no encontrada" });
        }

        if (parametros.titulo && recomendacionExistente.titulo !== parametros.titulo) {
            const tituloEnUso = await Recomendaciones.findOne({ titulo: parametros.titulo });
            if (tituloEnUso) {
                return res.status(500).send({ message: 'El título ingresado ya existe. Verifique los datos' });
            }
        }

        if (parametros.descripcion && recomendacionExistente.descripcion !== parametros.descripcion) {
            const descripcionEnUso = await Recomendaciones.findOne({ descripcion: parametros.descripcion });
            if (descripcionEnUso) {
                return res.status(500).send({ message: 'La descripción ingresada ya existe. Verifique los datos.' });
            }
        }

        const recomendacionEditada = await Recomendaciones.findByIdAndUpdate(idRecomendacionParam, parametros, { new: true });
        if (!recomendacionEditada) {
            return res.status(500).send({ message: "No se pudo editar la recomendación" });
        }
        return res.status(200).send({ Recomendaciones: recomendacionEditada });

    } catch (err) {
        return res.status(500).send({ message: "Error al editar la recomendación: " + err });
    }
}

module.exports = {
    editarRecomendacion,
    eliminarRecomendacion,
    registrarRecomendacion,
    obtenerRecomendaciones,
    obtenerRecomendacionId,
    registrarRecomendacionIA

}