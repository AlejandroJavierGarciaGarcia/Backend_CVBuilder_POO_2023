const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const md_autentificacion = require('../middlewares/aut');

var app = express.Router();

app.get('/clientes', usuariosController.ObtenerUsuarios),
app.post('/login', usuariosController.Login);
app.get('/usuariosId/:id?', md_autentificacion.Auth,usuariosController.ObtenerUsuariosId),
app.post('/agregarCliente', usuariosController.RegistrarCliente);

app.put('/editarUsuario/:idUsuario?', md_autentificacion.Auth,usuariosController.EditarUsuarios);

app.delete('/eliminarUsuario/:idUsuario?', md_autentificacion.Auth,usuariosController.EliminarUsuarios);

app.get('/usuarioLogueado',md_autentificacion.Auth, usuariosController.ObtenerUserLogueado),

 
module.exports = app; 