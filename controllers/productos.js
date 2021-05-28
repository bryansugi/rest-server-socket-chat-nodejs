const { response } = require('express')
const Schema = require('populate/render')
const Categoria = require('../models/categoria')
const Producto = require('../models/producto')


const obtenerProductos = async(req, res = response) => {

    const { limite = 1, desde = 0 } = req.query

    const [total, productos] = await Promise.all([

        Producto.countDocuments({ estado: true }),

        Producto.find({ estado: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))

    ])

    res.json({
        total,
        productos
    })
}

const obtenerProducto = async(req, res = response) => {

    const { id } = req.params

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')

    if (producto) {
        res.status(201).json({
            producto
        })
    }
}

const crearProducto = async(req, res = response) => {

    const { precio, descripcion, categoria, ...data } = req.body

    const nombre = data.nombre.toUpperCase()

    const nombreCat = {
        nombre: categoria
    }

    const categoriaDB = await Categoria.findOne(nombreCat)

    //generamos los datos a guardar
    const datos = {
        nombre,
        usuario: req.usuarioAuth._id,
        precio,
        categoria: categoriaDB._id,
        descripcion
    }

    //preparamos la instancia
    const producto = new Producto(datos)

    //guardamos el producto
    await producto.save()

    //imprimir respuesta
    res.status(201).json(producto)
}

const actualizarProducto = async(req, res = response) => {

    const { id } = req.params
    const { nombre, categoria, ...data } = req.body

    data.nombre = nombre.toUpperCase()
    data.usuario = req.usuarioAuth._id

    let datosCat = {
        nombre: categoria
    }

    const categoriaBD = await Categoria.findOne(datosCat)

    data.categoria = categoriaBD._id

    const actualizaProducto = await Producto.findByIdAndUpdate(id, data, { new: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')

    if (actualizaProducto) {
        res.status(201).json({
            actualizaProducto
        })
    }
}

//borrarCategoria - estado false
const borrarProducto = async(req, res = response) => {

    const { id } = req.params

    const deletePro = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })

    if (deletePro) {
        res.status(201).json({
            deletePro
        })
    }


}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}