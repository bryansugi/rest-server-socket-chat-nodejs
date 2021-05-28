const { Router } = require('express')
const { check } = require('express-validator')

const { validarJWT } = require('../middlewares/validar-jwt')
const { validarCampos } = require('../middlewares/validar-campos')
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles')

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators')

const {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
} = require('../controllers/usuarios')

const router = Router()

//en esta ruta obtenemos los datos para devolver info de la bd
router.get('/', usuariosGet)


//validaciones antes de guardar usuario
router.post('/', [

    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mas de 5 letras').isLength({ min: 5 }),
    check('password', 'El password debe ser menos de 9 letras').isLength({ max: 8 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRolValido),
    validarCampos

], usuariosPost)

//validaciones antes de actualizar usuario
router.put('/:id', [
    check('id', 'No es un ID valido!').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut)


//validaciones antes de eliminar
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE'),
    check('id', 'No es un ID valido!').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)

router.patch('/', usuariosPatch)

module.exports = router