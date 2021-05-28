const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { createServer } = require('http')

const { dbConnection } = require('../database/config')
const { socketController } = require('../socket/controllers')


class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.server = createServer(this.app)
        this.io = require('socket.io')(this.server)


        this.usuariosPath = '/api/usuarios'
        this.authPath = '/api/auth'
        this.categoriasPath = '/api/categorias'
        this.productosPath = '/api/productos'
        this.buscarPath = '/api/buscar'
        this.uploadsPath = '/api/uploads'

        //conectar a base de datos
        this.conectarDB()

        //middlewares
        this.middlewares()

        //rutas de mi aplicacion
        this.routes()

        //sockets
        this.sockets()
    }

    async conectarDB() {
        await dbConnection()
    }

    middlewares() {

        //cors
        this.app.use(cors())

        //lectura y parseo del body
        this.app.use(express.json())

        //directorio publico
        this.app.use(express.static('public'))

        //carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
        this.app.use(this.categoriasPath, require('../routes/categorias'))
        this.app.use(this.productosPath, require('../routes/productos'))
        this.app.use(this.buscarPath, require('../routes/buscar'))
        this.app.use(this.uploadsPath, require('../routes/uploads'))
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io))
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port)
        })
    }
}

module.exports = Server