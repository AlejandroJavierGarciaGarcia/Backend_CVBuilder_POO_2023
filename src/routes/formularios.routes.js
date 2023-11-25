const express = require('express');
const formulariosController = require('../controllers/formularios.controller');
const md_autentificacion = require('../middlewares/aut')




var app = express.Router();

//OBTENER FORMULARIOS
//app.get('/formularios', formulariosController.ObtenerFormularios),

//AGREGAR FORMULARIOS
//app.post('/agregarFormularios', md_autentificacion.Auth, formulariosController.RegistrarFormularios),

//OBTENER FORMULARIOS ID
//app.get('/formulariosID/:idUsuario',md_autentificacion.Auth, formulariosController.ObtenerFormularioID),

//OBTENER FORMULARIOS ID
//app.get('/expedientes', formulariosController.ObtenerUsuariosExpedientes),

//EDITAR FORMULARIOS
app.put('/suscripcionNormal', md_autentificacion.Auth, formulariosController.SuscripcionNormal),

//EDITAR FORMULARIOS
app.put('/suscripcionPremium', md_autentificacion.Auth, formulariosController.SuscripcionPremium),

module.exports = app;