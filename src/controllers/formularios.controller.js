const Usuarios = require("../models/usuarios.model");

function SuscripcionNormal(req, res) {                       
  Usuarios.findOneAndUpdate({ _id: req.user.sub }, { suscripcion: "Normal" }, { new: true }, (err, userUpdate) => {
    if (!userUpdate||err)
      return res.status(404).send({ message: "Erro al llevar a cabo la suscripcion" });

    return res.status(200) .send({ Usuario: userUpdate });
 
  });


}

function SuscripcionPremium(req, res) {                       
  Usuarios.findOneAndUpdate({ _id: req.user.sub }, { suscripcion: "Premium" }, { new: true }, (err, userUpdate) => {
    if (!userUpdate||err)
    return res.status(404).send({ message: "Erro al llevar a cabo la suscripcion" });
    return res.status(200) .send({ Usuario: userUpdate });
 
  });


}


module.exports = {
ObtenerFormularioID,
ObtenerFormularios,
RegistrarFormularios,
ObtenerUsuariosExpedientes,
SuscripcionNormal,
SuscripcionPremium
};
