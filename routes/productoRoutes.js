import express from 'express';
import { check } from 'express-validator';
const router = express.Router();
import * as productoController from '../controllers/productoController.js';
import checkAuth from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';
import validarCampos from '../middlewares/validarCampos.js';

router.get('/', productoController.obtenerProductos);

router.post('/', [
    checkAuth,
    upload.single('imagen'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio debe ser un número válido').isNumeric(),
    check('stock', 'El stock debe ser un número entero').isInt(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('categoria', 'La categoría no es un ID válido de Mongo').isMongoId(),
    check('vendedor', 'El vendedor no es un ID válido de Mongo').isMongoId(),
    validarCampos
], productoController.crearProducto);

router.get('/:id', productoController.obtenerProductoPorId);

router.put('/:id', [
    checkAuth,
    upload.single('imagen'),
    validarCampos
], productoController.actualizarProducto);

router.delete('/:id', checkAuth, productoController.eliminarProducto);

router.get('/vendedor/:id', productoController.obtenerProductosPorVendedor);
router.get('/categoria/:id', productoController.obtenerProductosPorCategoria);
router.get('/buscar/query', productoController.buscarProductos);

/**
 * @swagger
 * /api/productos/ia/generar-descripcion:
 *   post:
 *     summary: Generar descripción de producto con Gemini IA
 *     tags: [Inteligencia Artificial]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               atributos_claves:
 *                 type: string
 *     responses:
 *       200:
 *         description: Descripción generada
 */
router.post('/ia/generar-descripcion', checkAuth, productoController.generarDescripcionIA);

/**
 * @swagger
 * /api/productos/ia/sugerir-categoria:
 *   post:
 *     summary: Sugerir categoría con Gemini IA
 *     tags: [Inteligencia Artificial]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               textoPrincipal:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría sugerida
 */
router.post('/ia/sugerir-categoria', checkAuth, productoController.sugerirCategoriaIA);

export default router;