import express from 'express';
const router = express.Router();
import * as ordenController from '../controllers/ordenController.js';
import checkAuth from '../middlewares/authMiddleware.js';

router.get('/', checkAuth, ordenController.obtenerOrdenes);
router.post('/', checkAuth, ordenController.crearOrden);
router.get('/:id', checkAuth, ordenController.obtenerOrdenPorId);
router.delete('/:id', checkAuth, ordenController.eliminarOrden);

router.get('/usuario/:id', checkAuth, ordenController.obtenerOrdenesPorUsuario);
router.patch('/:id/estado', checkAuth, ordenController.actualizarEstadoOrden);

export default router;