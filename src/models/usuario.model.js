
const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var usuariosSchema = Schema({
    nombre: String,
    apellido: String,
    password: String,
    rol: String,
    email: String,
    edad: Number,
    usuario: String,
    ciudad:String,
    direccion:String,
    telefono:String,
    descripcion:String,
    suscripcion:String,
    sexo:String,

})

module.exports=mongoose.model('usuario',usuariosSchema)
 