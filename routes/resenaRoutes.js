import express from 'express';
const router = express.Router();
import * as resenaController from '../controllers/resenaController.js';
import checkAuth from '../middlewares/authMiddleware.js';

router.post('/', checkAuth, resenaController.crearResena);
router.get('/producto/:productoId', resenaController.obtenerResenasPorProducto);

// Ruta inteligente
router.get('/ia/analizar/:productoId', resenaController.analizarResenasIA);

export default router;
