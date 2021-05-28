const { response } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')

const usuariosGet = async(req, res = response) => {

    const { limite = 5, desde = 0, id = '' } = req.query

    /*  const [total, usuarios] = await Promise.all([

         Usuario.countDocuments({ estado: true }),

         Usuario.find({ estado: true })
         .skip(Number(desde))
         .limit(Number(limite))

     ]) */

    let usuarios = ''
    const total = await Usuario.countDocuments({ estado: true })
    if (id) {
        usuarios = await Usuario.findById(id)
    } else {
        usuarios = await Usuario.find({ estado: true })
            .skip(Number(desde))
            .limit(Number(limite))
    }

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async(req, res = response) => {


    const { nombre, correo, password, rol } = req.body

    const usuario = new Usuario({ nombre, correo, password, rol })

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)


    //se guarda en la BD
    await usuario.save()


    res.json({
        usuario
    })
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos
    if (password) {

        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)

    }

    //Este es el codigo que realiza la actualizacion el la base de datos
    const usuarioDB = await Usuario.findByIdAndUpdate(id, resto)


    res.json({
        usuarioDB
    })
}


const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;

    //fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id)
    const usuarioAutenticado = req.usuarioAuth

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false })


    res.json({
        usuario,
        usuarioAutenticado
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch de mi api -controller'
    })
}
module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}