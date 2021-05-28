const { Router } = require('express')
const { check } = require('express-validator')
const {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias')

const { existeCategoria } = require('../helpers/db-validators')

const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')
const { esAdminRole } = require('../middlewares/validar-roles')

const router = Router()


//obtener categorias
router.get('/', obtenerCategorias)

//obtener categorias por id
router.get('/:id', [
    check('id', 'No es un ID valido!').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria)

//crear categoria-privado-cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

//actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido!').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoria),
    validarCampos
], actualizarCategoria)

//borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido!').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria)


module.exports = router