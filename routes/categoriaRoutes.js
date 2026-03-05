import express from 'express';
const router = express.Router();
import * as categoriaController from '../controllers/categoriaController.js';
import checkAuth from '../middlewares/authMiddleware.js';

router.get('/', categoriaController.obtenerCategorias);
router.post('/', checkAuth, categoriaController.crearCategoria);
router.get('/:id', categoriaController.obtenerCategoriaPorId);
router.put('/:id', checkAuth, categoriaController.actualizarCategoria);
router.delete('/:id', checkAuth, categoriaController.eliminarCategoria);

export default router;