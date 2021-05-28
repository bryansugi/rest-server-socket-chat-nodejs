const { response } = require('express')
const { ObjectId } = require('mongoose').Types
const Schema = require('populate/render')

const Usuario = require('../models/usuario')
const Categoria = require('../models/categoria')
const Producto = require('../models/producto')


const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino)

    if (esMongoID) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    //expresion regular de javascript 
    const regex = new RegExp(termino, 'i')

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })

    res.json({
        results: usuarios
    })



}

const buscarCategorias = async(termino = '', res = response) => {

    const isMongoID = ObjectId.isValid(termino)

    if (isMongoID) {
        const categoria = await Categoria.findById(termino).populate('usuario', 'nombre')
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const categoria = await Categoria.find({ nombre: regex }).populate('usuario', 'nombre')

    res.json({
        results: categoria
    })
}

const buscarProductos = async(termino = '', res = response) => {

    const isMongoID = ObjectId.isValid(termino)

    if (isMongoID) {
        const producto = await Producto.findById(termino)
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const producto = await Producto.find({ nombre: regex })

    res.json({
        results: producto
    })
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'categoria':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;

        default:
            res.status(500).json({
                msg: 'Error haciendo la busqueda'
            })
            break;
    }

}

module.exports = {
    buscar
}