
const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var recomenacionesSchema = Schema({
    titulo: String,
    descripcion: String,
    tips: [],
    clasificacion: String
})
module.exports=mongoose.model('recomendacion',recomenacionesSchema)
