const { response } = require('express')
const Categoria = require('../models/categoria')
const Schema = require('populate/render')


//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req, res = response) => {

    const { limite = 0, desde = 0 } = req.query

    const [total, categorias] = await Promise.all([

        Categoria.countDocuments({ estado: true }),

        Categoria.find({ estado: true })
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))

    ])

    res.json({
        total,
        categorias
    })



}

//obtenerCategoria -populate{}
const obtenerCategoria = async(req, res = response) => {

    const { id } = req.params

    const categoriasDB = await (await Categoria.findById(id).populate('usuario', 'nombre'))


    res.status(201).json({
        categoriasDB
    })


}


const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase()

    const categoriaDB = await Categoria.findOne({ nombre })

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    // generamos los datos a guardar
    const data = {
        nombre,
        usuario: req.usuarioAuth._id
    }

    //preparamos la insercion
    const categoria = new Categoria(data)

    //guardamos
    await categoria.save()

    //imprimir respuesta
    res.status(201).json(categoria)

}

//actualizarCategoria
const actualizarCategoria = async(req, res = response) => {

    const { id } = req.params
    const { estado, usuario, ...data } = req.body

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuarioAuth._id

    const actualizaCat = await Categoria.findByIdAndUpdate(id, data, { new: true })

    if (actualizaCat) {
        res.status(201).json({
            actualizaCat
        })
    }
}

//borrarCategoria - estado false
const borrarCategoria = async(req, res = response) => {

    const { id } = req.params

    const categoriaDB = await Categoria.findById(id)

    const deleteCat = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })

    if (deleteCat) {
        res.status(201).json({
            deleteCat
        })
    }


}


module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
}