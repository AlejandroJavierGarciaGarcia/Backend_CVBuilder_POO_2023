const mongoose = require('mongoose');
const app = require('./app');
require("dotenv").config({ path: "datos.env" });

mongoose.Promise = global.Promise;
//mongoose.connect(process.env.CONEXION_DB_MONGODB, {useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  mongoose.connect(process.env.CONEXION_DB_MONGODB, {useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{

    console.log("Se encuentra conectado a la base de datos");

}).catch(err => console.log(err))

  const server = app.listen(process.env.PORT || 3000, function () {
    console.log("Esta corriendo en el puerto 3000");
  });


const SocketIo = require("socket.io");
const io = SocketIo(server);

//web sockets

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("message", (messageInfo) => {
    console.log("Enviando mensaje" + messageInfo);
    socket.broadcast.emit("getMessage", messageInfo);
  });
}); 

