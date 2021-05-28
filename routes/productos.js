const { Router } = require('express')
const { check } = require('express-validator')
const {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos')
const { existeProducto, existeProductoPorId, existeCategoriaProd } = require('../helpers/db-validators')

const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')
const { esAdminRole } = require('../middlewares/validar-roles')

const router = Router()

//obtener todos los productos  - paginados
router.get('/', obtenerProductos)

//obtener producto por id
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto)

router.post('/', [
    validarJWT,
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(existeProducto),
    check('categoria').custom(existeCategoriaProd),
    validarCampos
], crearProducto)

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('categoria').custom(existeCategoriaProd),
    validarCampos
], actualizarProducto)

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto)

module.exports = router