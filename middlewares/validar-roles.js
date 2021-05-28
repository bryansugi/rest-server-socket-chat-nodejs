const { response } = require('express')

const esAdminRole = (req, res = response, next) => {


    try {
        if (!req.usuarioAuth) {
            res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        const { rol, nombre } = req.usuarioAuth

        if (rol !== 'ADMIN_ROLE') {
            res.status(401).json({
                msg: `${nombre} no es administrador - no puede acceder`
            })
        }

        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Ocurrio una inconsistencia'
        })

    }


}

const tieneRole = (...roles) => {

    return (req, res = response, next) => {

        if (!req.usuarioAuth) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if (!roles.includes(req.usuarioAuth.rol)) {
            return res.status(401).json({
                msg: `El servicio require uno de estos roles ${roles}`
            })
        }

        next()

    }

}

module.exports = {
    esAdminRole,
    tieneRole
}