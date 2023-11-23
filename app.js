
var express = require('express');
const cors = require('cors');
var app = express();


//IMPORTACIONES RUTAS
const rutaUsuario = require('./src/routes/usuarios.routes');
const rutaRecomendacion = require('./src/routes/recomendacion.routes');

//MIDDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//CABECERAS
app.use(cors());


//CARGA DE RUTAS se realizaba como localhost:3000/api
app.use("/api", rutaUsuario,rutaRecomendacion);

module.exports = app; 
