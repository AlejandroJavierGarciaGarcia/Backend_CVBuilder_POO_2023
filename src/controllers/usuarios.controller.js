
/**
 * @author Ana Laura Tschen, Jonathan Zacarías, Alejandro García
 * @version 1.0
 * @date 18/09/2023
 * Comentado con IA
 */

const Usuarios = require('../models/usuario.model')
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt')

/**
 * Register a default administrator user if it does not already exist.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function registarAdminDefecto(req, res) {
    var usuarioModelo = new Usuarios();
    usuarioModelo.nombre = 'SuperAdmin';
    usuarioModelo.usuario = 'SuperAdmin';
    usuarioModelo.rol = 'ROL_ADMINISTRADOR';
    
    try {
        const usuarioGuardado = await Usuarios.findOne({ nombre: 'SuperAdmin' });

        if (!usuarioGuardado) {
            const passwordEncrypt = await bcrypt.hash('uvg2023', 10);
            usuarioModelo.password = passwordEncrypt;
            await usuarioModelo.save();
            console.log('Usuario administrador creado');
        } else {
            console.log('El usuario administrador ya existe');
        }
    } catch (err) {
        console.error('Error al registrar usuario administrador:', err);
    }
}



/*
CONSULTAR FUNCIONAMINETO
function registarAdminDefecto(req, res) {
    var usuarioModelo = new Usuarios();
    usuarioModelo.nombre = 'SuperAdmin';
    usuarioModelo.usuario = 'SuperAdmin';
    usuarioModelo.rol = 'ROL_ADMINISTRADOR';
    Usuarios.find({ nombre: 'SuperAdmin' }, (err, usuarioGuardado) => {
        if (usuarioGuardado.length == 0) {
            brycpt.hash("uvg2023", null, null, (err, passswordEncypt) => {
                usuarioModelo.password = passswordEncypt
                usuarioModelo.save((err, usuarioGuardadoSegundo) => {
                    console.log('Usuario administrador creado')
                })
            })
        } else {
            console.log('El usuario adminitrador ya existe')
        }
    })
}*/


/**
 * Retrieve users excluding administrators.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function ObtenerUsuarios(req, res) {
    Usuarios.find({ rol: { $ne: 'ROL_ADMINISTRADOR' } }, (err, usuariosObtenidos) => {
        if(err) return res.send({message: "error:" + err})
    
        for (let i = 0; i < usuariosObtenidos.length; i++) {
        console.log(usuariosObtenidos[i].nombre)
        }
        return res.send({Clientes: usuariosObtenidos})
    });
} 
/**
 * Get a user by their ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function ObtenerUsuariosId(req, res) {
  const idUsuario = req.params.id;
  Usuarios.findById(idUsuario)
    .then(clienteEncontrado => {
      if (!clienteEncontrado) {
        return res.status(404).send({ message: "Error, no se encontró empleado" });
      }
      return res.status(200).send({ clienteEncontrado });
    })
    .catch(error => {
      return res.status(500).send({ message: "Error en la petición" });
    });
}
/**
 * Get the currently logged-in user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function ObtenerUserLogueado(req, res) {
  Usuarios.findOne({ _id: req.user.sub })
    .then(UserLogin => {
      if (!UserLogin) {
        return res.status(404).send({ message: "Error, no se encontraron usuarios" });
      }
      return res.status(200).send({ usuario: UserLogin });
    })
    .catch(error => {
      return res.status(500).send({ message: "Error en la petición" });
    });
}
  
//METODO PARA PODER INICIAR SESION
/**
 * Log in a user with username and password.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function Login(req, res) {
  const parameters = req.body;
  Usuarios.findOne({ usuario: parameters.usuario })
    .then(usuarioLogeado => {
      if (!usuarioLogeado) {
        return res.status(404).send({ message: "Usuario incorrecto, verifique los datos." });
      }
      bcrypt.compare(parameters.password, usuarioLogeado.password)
        .then(passwordComparacion => {
          if (passwordComparacion) {
            console.log(parameters.obtenerToken)
            console.log(parameters.usuario)
            if (parameters.obtenerToken == "true") {
              const token = jwt.crearToken(usuarioLogeado);
              return res.status(200).send({ token });
            } else {
              const token = jwt.crearToken(usuarioLogeado);
              usuarioLogeado.password = undefined;
              return res.status(200).send({ usuario: usuarioLogeado,token });
            }
          } else {
            return res.status(404).send({ message: "Contraseña incorrecta" });
          }
        })
        .catch(error => {
          return res.status(500).send({ message: "Error al comparar la contraseña" });
        });
    })
    .catch(error => {
      return res.status(500).send({ message: "Error en la petición" });
    });
}

/*
Sin función asíncrona
function Login(req, res) {
    var parameters = req.body;
    Usuarios.findOne({ usuario: parameters.usuario }, (err, usuarioLogeado) => {
      if (err) return res.status(500).send({ message: "error en la peticion" });
      if (usuarioLogeado) {
        brycpt.compare(
          parameters.password,
          usuarioLogeado.password,
          (err, passwordComparacion) => {
            if (passwordComparacion) {
              if (parameters.obtenerToken === "true") {
                return res
                  .status(200)
                  .send({ token: jwt.crearToken(usuarioLogeado) });
              } else {
                usuarioLogeado.password = undefined;
                return res.status(200).send({ usuario: usuarioLogeado });
              }
            } else {
              return res.status(404).send({ message: "Contraseña incorrecta" });
            }
          }
        );
      } else {
        return res
          .status(404)
          .send({ message: "Usuario incorrecto, verifique los datos." });
      }
    });
  }
*/

/*
USER REGISTER
*/
/**
 * Register a new client user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
  function RegistrarCliente(req, res) {
    const parametros = req.body;
    if (parametros.nombre && parametros.usuario && parametros.password && parametros.apellido) {

      let camposAValidar = ['usuario'];
      let verificacionesPendientes = [];

      for (let campo of camposAValidar) {
        verificacionesPendientes.push(
            Usuarios.findOne({ [campo]: parametros[campo] })
        );
    }

      Promise.all(verificacionesPendientes).then(resultados => {
        for (let resultado of resultados) {
            if (resultado) {
                return res.status(400).send({ message: `El usuario ingresado ya está en uso` });
            }
        }

        bcrypt.hash(parametros.password, 10, (err, passwordEncriptada) => {
            if (err) {
                return res.status(500).send({ message: 'Error al cifrar la contraseña' });
            }

            const nuevoUsuario = new Usuarios({
                nombre: parametros.nombre,
                apellido: parametros.apellido,
                usuario: parametros.usuario,
                password: passwordEncriptada,
                rol: 'ROL_CLIENTE',
            });

            nuevoUsuario.save()
                .then(usuarioGuardado => {
                    return res.status(200).send({ Usuario: usuarioGuardado });
                })
                .catch(error => {
                    return res.status(500).send({ message: 'Error al guardar el usuario' });
                });
        });
    }).catch(error => {
        return res.status(500).send({ message: `El usuario ingresado ya está en uso` });

    });
    } else {
      return res.status(400).send({ message: 'Llene todos los campos requeridos' });
    }
  }

  /**
 * Edit a user's information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
  function editarUsuarios(req, res) {
    const idUser = req.params.idUsuario;
    const parametros = req.body;
    console.log(idUser)
    // Buscar el usuario por su ID
    Usuarios.findOne({ _id: idUser })
      .then(usuarioBuscado => {
        if (!usuarioBuscado) {
          return res.status(404).send({ message: "Error, el usuario no existe. Verifique el ID" });
        }
  
        if (usuarioBuscado.rol === "ROL_ADMINISTRADOR") {
          // No es posible editar a los administradores
          return res.status(500).send({ message: 'No es posible editar Administradores' });
        } else {

          if (req.user.rol === "ROL_ADMINISTRADOR") {
            // Administrador puede editar usuarios
            Usuarios.findByIdAndUpdate(idUser, parametros, { new: true })
              .then(usuarioActualizado => {
                if (!usuarioActualizado) {
                  // Si no se pudo actualizar, responder con un estado 404
                  return res.status(404).send({ message: 'Error al editar usuario' });
                }
                // Responder con el usuario actualizado
                return res.status(200).send({ usuario: usuarioActualizado });
              })
              .catch(error => {
                // Manejar errores en la petición
                return res.status(500).send({ message: 'Error en la petición' });
              });
          } else {
            // El Cliente solo puede editar su propio perfil
            if (usuarioBuscado._id == req.user.sub) {
              Usuarios.findByIdAndUpdate(idUser, parametros, { new: true })
                .then(usuarioActualizado => {
                  if (!usuarioActualizado) {
                    // Si no se pudo actualizar, responder con un estado 404
                    return res.status(404).send({ message: 'Error al editar el usuario' });
                  }
                  // Responder con el usuario actualizado
                  return res.status(200).send({ usuario: usuarioActualizado });
                })
                .catch(error => {
                  // Manejar errores en la petición
                  return res.status(500).send({ message: 'Error en la petición' });
                });
            } else {
              // El usuario no tiene permisos para editar otros usuarios
              return res.status(500)
                .send({ message: 'No puede editar otros usuarios, solamente su propio perfil de usuario' });
            }
          }
        }
      })
      .catch(error => {
        // Manejar errores en la petición
        console.log(error)
        return res.status(500).send({ message: " - Error en la petición." });
      });
  }

  /*
  No asincrónico
function EditarUsuarios(req, res) {
  var idUser = req.params.idUsuario;
  var parametros = req.body;

  Usuarios.findOne({ _id: idUser }, (err, usuarioBuscado) => {
    if (err) return res.status(500).send({ message: "Error, el usuario no existe. Verifique el ID" });
    if (!usuarioBuscado) return res.status(404).send({ message: "Error, el usuario no existe. Verifique el ID" })

    if (usuarioBuscado.rol == "ROL_ADMINISTRADOR") {
      return res.status(500).send({ message: 'No es posible editar Administradores' });
    } else {//Acepta solo ID de clientes
      if (req.user.rol == "ROL_ADMINISTRADOR") {//Administrador puede editar usuarios

        if (parametros.rol == '') {


          Usuarios.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioActualizado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (!usuarioActualizado) return res.status(404).send({ message: 'Error al editar usuario' });

          });




        } else {
          Usuarios.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioActualizado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (!usuarioActualizado) return res.status(404).send({ message: 'Error al editar la empresa' });
            return res.status(200).send({ usuario: usuarioActualizado });
          });
        }


      } else {//El CLiente solo puede editar perfil
        //console.log(usuarioBuscado._id)

        if (usuarioBuscado._id == req.user.sub) {
          //console.log(usuarioBuscado._id)
          console.log(parametros)

          Usuarios.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioActualizado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (!usuarioActualizado) return res.status(404).send({ message: 'Error al editar la empresa' });
            return res.status(200).send({ usuario: usuarioActualizado });
          });

        } else {
          return res.status(500)
            .send({ message: 'No puede editar otros usuarios, solamnete su perfil de usuario' });
        }
      }
    }
  })
}*/

/**
 * Method to delete a user without validation.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
//METODO PARA ELIMINAR  USUARIO SIN VALIDACIONES AUN
function EliminarUsuarios(req, res) {
  const idUsu = req.params.idUsuario;

  Usuarios.findByIdAndDelete(idUsu)
    .then(usuarioEliminado => {
      if (!usuarioEliminado) {
        return res.status(404).send({ message: 'No se encontraron usuarios' });
      }
      return res.status(200).send({ usuarios: usuarioEliminado });
    })
    .catch(err => {
      return res.status(500).send({ message: 'Error en la petición' });
    });
}


module.exports = {
    Login,
    registarAdminDefecto,
    RegistrarCliente,
    EditarUsuarios: editarUsuarios,
    EliminarUsuarios,
    ObtenerUsuarios,
    ObtenerUsuariosId,
    ObtenerUserLogueado
}