const Categoria = require('../models/categoria')
const Producto = require('../models/producto')
const Role = require('../models/role')
const Usuario = require('../models/usuario')


//-------------------------validadores usuario y rol
const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }

}

//validar si el correo existe
const emailExiste = async(correo = '') => {

    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe en la BD`)
    }

}

const existeUsuarioPorId = async(id) => {

    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe en la BD`)
    }

}

//-----------validadores categorias

const existeCategoria = async(id) => {

    const categoria = await Categoria.findById(id)
    if (!categoria) {
        throw new Error(`El id ${id} no existe en la BD`)
    }

}

//-------------------validadores productos

const existeProducto = async(nombre) => {

    const productoDB = await Producto.findOne({ nombre })

    if (productoDB) {
        throw new Error(`El producto con nombre ${nombre} ya existe en la BD`)
    }

}

const existeProductoPorId = async(id) => {

    const productoDB = await Producto.findById(id)

    if (!productoDB) {
        throw new Error(`El producto con id ${id} no existe en la BD`)
    }

}

const existeCategoriaProd = async(categoria) => {

    let data = {
        nombre: categoria
    }

    const categoriaDB = await Categoria.findOne(data)

    if (!categoriaDB) {
        throw new Error(`La categoria ${categoria} no existe por favor verifique!`)
    }

}

//validar colecciones permitidas
const coleccionesPermitidas = (coleccion, colecciones = []) => {

    const coleccionesPermit = colecciones.includes(coleccion)

    if (!coleccionesPermit) {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${ colecciones}`);
    }

    return true;
}



module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    existeProductoPorId,
    existeCategoriaProd,
    coleccionesPermitidas
}