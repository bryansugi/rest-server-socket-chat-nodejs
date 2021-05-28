const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {


        const payload = { uid }

        //aqui jeneramos el token
        jwt.sign(payload, process.env.SECRETKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {

                console.log(err)
                reject('No se puedo generar el token')

            } else {

                resolve(token)

            }
        })


    })
}

const comprobarJWT = async(token = '') => {
    try {
        if (token.length < 10) {
            return null
        }

        const { uid } = jwt.verify(token, process.env.SECRETKEY)

        const usuario = await Usuario.findById(uid)

        if (usuario) {
            if (usuario.estado) {
                return usuario
            } else {
                return null
            }
        } else {
            return null
        }


    } catch (error) {
        return null
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}