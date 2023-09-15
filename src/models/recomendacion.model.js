
const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var productosEmpresaSchema = Schema({
    idUsuario: { type: Schema.Types.ObjectId, ref: 'usuario' },
    recomendacionesFoto: [{
        titulo: String,
        descripcion: String
    }],
    recomendacionesHabilidades: [{
        titulo: String,
        descripcion: String
    }],
    recomendacionesExperiencia: [{
        titulo: String,
        descripcion: String
    }],
    recomendacionesEducacion: [{
        titulo: String,
        descripcion: String
    }],
    recomendacionesIdiomas: [{
        titulo: String,
        descripcion: String
    }]
})

module.exports=mongoose.model('recomendacion',productosEmpresaSchema)
