const express = require('express');
const recomendacionesController = require('../controllers/recomendacion.controller');
const md_autentificacion = require('../middlewares/aut')


var app = express.Router();

//OBTENER ARTÍCULOS
app.get('/recomendaciones', recomendacionesController.obtenerRecomendaciones),

//AGREGAR ARTÍCULOS
app.post('/agregarRecomendacion',md_autentificacion.Auth, recomendacionesController.registrarRecomendacionIA),

// //EDITAR ARTÍCULOS
app.put('/editarRecomendacion/:idRecomendacion?',md_autentificacion.Auth, recomendacionesController.editarRecomendacion),

//OBTENER ARTÍCULOS ID 

app.get('/recomendacionId/:idRecomendacion?', md_autentificacion.Auth, recomendacionesController.obtenerRecomendacionId),
// //ELIMINAR ARTÍCULOS

app.delete('/eliminarRecomendacion/:idRecomendacion?', md_autentificacion.Auth,recomendacionesController.eliminarRecomendacion),

module.exports = app;