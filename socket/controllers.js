const { Socket } = require('socket.io')
const { comprobarJWT } = require('../helpers/generar-jwt')
const { ChatMensajes } = require('../models/chat-mensajes')


const chatMensajes = new ChatMensajes()

const socketController = async(socket, io) => {

    const token = socket.handshake.headers['x-token']
    const usuario = await comprobarJWT(token)

    if (!usuario) {
        return socket.disconnect()
    }

    //agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario)
    io.emit('usuarios-activos', chatMensajes.UsuariosArray)
    socket.emit('recibir-mensajes', chatMensajes.UltimosMsg)

    //conectarlo a una sala especial
    socket.join(usuario.id)

    //limpiar cuando alguien se desconecte
    socket.on('disconnect', () => {
        const id = usuario.id
        chatMensajes.desconectarUsuario(id)
        io.emit('usuarios-activos', chatMensajes.UsuariosArray)
    })

    socket.on('enviar-mensaje', ({ mensaje, uid }) => {

        if (uid) {
            //mensaje privado
            socket.to(uid).emit('mensaje-privado', { de: usuario.nombre, mensaje })
        } else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje)
            io.emit('recibir-mensajes', chatMensajes.UltimosMsg)
        }
    })

}

module.exports = {
    socketController
}