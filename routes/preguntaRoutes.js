import express from 'express';
const router = express.Router();
import * as preguntaController from '../controllers/preguntaController.js';
import checkAuth from '../middlewares/authMiddleware.js';

router.post('/', checkAuth, preguntaController.crearPregunta);
router.get('/producto/:productoId', preguntaController.obtenerPreguntasPorProducto);

// Ruta inteligente IA
router.get('/ia/sugerir-respuesta/:preguntaId', checkAuth, preguntaController.sugerirRespuestaIA);

export default router;
