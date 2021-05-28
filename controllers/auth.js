const { response } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async(req, res = response) => {

    const { correo, password } = req.body

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            res.status(400).json({
                msg: 'Usuaurio / password no son correctos - correo'
            })
        }

        // verificar el usuario esta activo
        if (!usuario.estado) {
            res.status(400).json({
                msg: 'Usuario no esta activo'
            })
        }


        //verificar ña cpontraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            res.status(400).json({
                msg: 'Usuario / password no son correctos - password'
            })
        }

        //generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })


    } catch (error) {

        console.log(error)

        res.status(500).json({
            msj: 'Hable con el administrador'
        })
    }


}

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body


    try {

        const { nombre, img, correo } = await googleVerify(id_token)
        let usuario = await Usuario.findOne({ correo })

        if (!usuario) {
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }

            usuario = new Usuario(data)

            await usuario.save()
        }

        //si el usuario esta en la base de datos entonces...

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario inactivo'
            })
        }

        //generar el JWT
        const token = await generarJWT(usuario.id)


        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Token de google no es valido'
        })

    }
}

const renovarToken = async(req, res) => {
    const usuario = req.usuarioAuth

    //generar el JWT
    const token = await generarJWT(usuario.id)

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignin,
    renovarToken
}