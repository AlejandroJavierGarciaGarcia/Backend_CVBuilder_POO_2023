
const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var sucursalesSchema = Schema({
    background: String,
    colores: String,
    font: String,
    style: String,
    paperSize:String,
    idUsuario: { type: Schema.Types.ObjectId, ref: 'usuario'},
})

module.exports=mongoose.model('diseñoCV',sucursalesSchema)
