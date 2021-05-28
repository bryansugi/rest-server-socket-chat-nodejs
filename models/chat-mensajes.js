class Mensaje {
    constructor(uid, nombre, mensaje) {
        this.uid = uid
        this.nombre = nombre
        this.mensaje = mensaje
    }
}

class ChatMensajes {

    constructor() {
        this.mensajes = []
        this.usuarios = {}
    }

    //getter para obtener los 10 ultimos mensajes del chat
    get UltimosMsg() {
        this.mensajes = this.mensajes.splice(0, 20)
        return this.mensajes
    }

    get UsuariosArray() {
        return Object.values(this.usuarios) //esto me retorna un array asi [{},{},{}]
    }

    enviarMensaje(uid, nombre, mensaje) {
        this.mensajes.unshift( //la funcion unshift inserta la informacion al inicio
            new Mensaje(uid, nombre, mensaje)
        )
    }

    conectarUsuario(usuario) {
        this.usuarios[usuario.id] = usuario
    }

    desconectarUsuario(id) {
        delete this.usuarios[id]
    }

}

module.exports = {
    ChatMensajes
}