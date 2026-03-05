import express from 'express';
import { check } from 'express-validator';
const router = express.Router();
import * as usuarioController from '../controllers/usuarioController.js';
import checkAuth from '../middlewares/authMiddleware.js';
import validarCampos from '../middlewares/validarCampos.js';

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve JWT
 */
router.post('/login', [
    check('correo', 'El correo es obligatorio y debe tener formato válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], usuarioController.loginUsuario);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'Debe ser un correo válido').isEmail(),
    check('password', 'La contraseña debe ser mínimo de 6 caracteres').isLength({ min: 6 }),
    check('edad', 'La edad es obligatoria y debe ser un número').isNumeric(),
    validarCampos
], usuarioController.crearUsuario);

router.get('/', checkAuth, usuarioController.obtenerUsuarios);
router.get('/:id', checkAuth, usuarioController.obtenerUsuarioPorId);
router.put('/:id', checkAuth, usuarioController.actualizarUsuario);
router.delete('/:id', checkAuth, usuarioController.eliminarUsuario);

export default router;
