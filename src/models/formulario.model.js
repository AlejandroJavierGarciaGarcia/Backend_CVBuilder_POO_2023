
const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var formulariosSchema = Schema({
    idUsuario: { type: Schema.Types.ObjectId, ref: 'usuario'},
    //DATOS QUE SE SOLICITAN EN EL FORMULARIO
    resumenPerfil: String,

    
    idiomas: [{
        nombre: String,
        nivel: String
    }],
    educacion: [{
        institucion: String,     
        titulo: String,         
        campoDeEstudio: String,
        fechaInicio: Date,      
        fechaFin: Date         
    }],
        certificaciones: [{
        nombre: String,
        fechaObtencion: Date
    }],
    experiencias: [{
        puesto: String,
        empresa: String,
        fechaInicio: Date,
        fechaFin: Date
    }],
    habilidadesBlandas: [{ type: String }],
    habilidadesTecnicas: [{ type: String }],
    redesSociales: {
        linkedin: String,
        github: String,
        sitioWeb: String
    },
    referencias: [{
        nombre: String,
        contacto: String
    }],
    estadoEmpleo: String ,
    proyectosRelevantes: [{ // Proyectos Relevantes
        nombre: String,
        descripcion: String,
        rol: String,
    }],

})

module.exports=mongoose.model('formulario',formulariosSchema)
 