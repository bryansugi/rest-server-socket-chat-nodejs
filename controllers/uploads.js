const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { response } = require('express');

const { subirArchivo } = require('../helpers/subir-archivo');

const Producto = require('../models/producto');
const Usuario = require('../models/usuario');


const cargarArchivo = async(req, res = response) => {

    try {

        //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos')
        const nombre = await subirArchivo(req.files, undefined, 'imgs')
        res.json({
            nombre
        })

    } catch (msg) {
        res.status(400).json({
            msg
        })
    }

}

const actualizarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })

    }

    //limpiar imagenes previas

    //validamos si hay imagenes en la BD
    if (modelo.img) {
        //hay que elimiar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen)
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion)
    modelo.img = nombre

    await modelo.save()

    res.json(modelo)
}


const actualizarImagenCloudinary = async(req, res = response) => {
    const { id, coleccion } = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })

    }

    //limpiar imagenes previas

    //validamos si hay imagenes en la BD
    if (modelo.img) {

        //realizamos la eliminacion de la imagen en cloudinary
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[nombreArr.length - 1]
        const [public_id] = nombre.split('.')

        cloudinary.uploader.destroy(public_id)

    }

    //subimos archivo a cloudinary
    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
    modelo.img = secure_url

    await modelo.save()

    res.json(modelo)
}


const mostrarImagen = async(req, res) => {

    const { id, coleccion } = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })

    }

    //limpiar imagenes previas

    //validamos si hay imagenes en la BD
    if (modelo.img) {
        //hay que elimiar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg')
    if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen)
    }

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}