const Usuarios = require('../models/usuario.model')
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt')

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



function ObtenerUsuarios(req, res) {
    Usuarios.find({ rol: { $ne: 'ROL_ADMINISTRADOR' } }, (err, usuariosObtenidos) => {
        if(err) return res.send({message: "error:" + err})
    
        for (let i = 0; i < usuariosObtenidos.length; i++) {
        console.log(usuariosObtenidos[i].nombre)
        }
        return res.send({Clientes: usuariosObtenidos})
    });
} 

function ObtenerUsuariosId(req, res) {
    var idUsuario = req.params.id
        Usuarios.findById(idUsuario, (err, clientecontrado) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" });
            if (!clientecontrado) return res.status(404).send({ message: "Error, no se encuentran empleado" });
            return res.status(200).send({ clienteEncontrado: clientecontrado })
        })
}

function ObtenerUserLogueado(req, res) {
    Usuarios.findOne({ _id: req.user.sub }, (err, UserLogin) => {
      if (err) return res.status(500).send({ message: "Error en la peticion" });
      if (!UserLogin)
        return res
          .status(404)
          .send({ message: "Error, no se encuentran usuarios" });
      return res.status(200).send({ usuario: UserLogin });
    });
  }
  
//METODO PARA PODER INICIAR SESION
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

function RegistrarCliente(req, res) {
    var parametros = req.body;
    var usuarioModelo = new Usuarios();
    if (parametros.nombre && parametros.usuario && parametros.password && parametros.apellido) {
      usuarioModelo.nombre = parametros.nombre;
      usuarioModelo.apellido = parametros.apellido
      usuarioModelo.usuario = parametros.usuario;
      usuarioModelo.rol = 'ROL_CLIENTE';
      Usuarios.findOne({ usuario: parametros.usuario }, (err, usuarioEcontrado) => {
        if (usuarioEcontrado == null) {
          brycpt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
            usuarioModelo.password = passwordEncriptada;
            usuarioModelo.save((err, usuarioGuardado) => {
              if (err) return res.status(500).send({ message: 'Error en la peticion' });
              if (!usuarioGuardado) return res.status(404).send({ message: 'No se encontraron usuarios' });
  
              return res.status(200).send({ Empresa: usuarioGuardado });
            });
          });
        } else {
          return res.status(400).send({ message: 'Este usuario ya esta siendo utilizado, pruebe usando otro' });
        }
  
      })
    } else {
      return res.status(500).send({ message: 'Llene todos los campos requeridos' });
    }
}

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


          // Usuarios.findOne({idHotel:parametros.idHotel},(err, hotelAdmnRegistrado) =>{
          //   if(hotelAdmnRegistrado!=null) return res.status(404).send( { message: 'El hotel ya posee un administrador. Seleccione otro.'});
          Usuarios.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioActualizado) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (!usuarioActualizado) return res.status(404).send({ message: 'Error al editar usuario' });

            //   Hoteles.findByIdAndUpdate(usuarioActualizado.idHotel, {idUsuario:usuarioActualizado._id}, { new: true } ,(err, hotelActualizado) => {
            //     if (err) return res.status(500).send({ message: 'Error en la peticion'});
            //     if(!hotelActualizado) return res.status(404).send( { message: 'Error al editar hotel'});

            //     return res.status(200).send({ empresa: hotelActualizado});
            // });

          });

          // })


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
}

//METODO PARA ELIMINAR  USUARIO SIN VALIDACIONES AUN
function EliminarUsuarios(req, res) {
    var idUsu = req.params.idUsuario;
    Usuarios.findByIdAndDelete(idUsu, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'});
        if(!usuarioEliminado) return res.status(404).send({message: 'No se encontraron usuarios'});

        return res.status(200).send({usuarios: usuarioEliminado});
    })

    
}


module.exports = {
    Login,
    registarAdminDefecto,
    RegistrarCliente,
    EditarUsuarios,
    EliminarUsuarios,
    ObtenerUsuarios,
    ObtenerUsuariosId,
    ObtenerUserLogueado
}