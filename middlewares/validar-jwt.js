const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const validarJWT = async(req, res, next) => {

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETKEY)
            //req.uid = uid

        //leer el usuario que corresponde a uid
        const usuarioAuth = await Usuario.findById(uid)

        if (!usuarioAuth) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en BD'
            })
        }

        //verificar si el uid tiene estado true
        if (!usuarioAuth.estado) {
            return res.status(401).json({
                msg: "Token no valido - usuario en false"
            })
        }
        req.usuarioAuth = usuarioAuth

        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'Token invalido'
        })
    }


}

module.exports = {
    validarJWT
}