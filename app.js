
var express = require('express');
const cors = require('cors');
var app = express();


//MIDDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//CABECERAS
app.use(cors());



module.exports = app; 
