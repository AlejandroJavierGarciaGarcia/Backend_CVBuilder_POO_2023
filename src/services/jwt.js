const jwt_simple = require('jwt-simple')

const moment = require('moment')
const secret = 'key_UVG_POO2023'

exports.crearToken = function(usuario){
    let payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        iat: moment().unix(),
        wxp:moment().day(7, 'days').unix()
        
    }
    return jwt_simple.encode(payload,secret)
}