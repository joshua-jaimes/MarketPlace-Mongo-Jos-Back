import Resena from '../models/resena.js';
import * as geminiService from '../services/geminiService.js';

// Crear Reseña
export const crearResena = async (req, res) => {
    try {
        const { producto, comprador, comentario, calificacion } = req.body;
        // Validaciones básicas que normalmente haríamos con express-validator...
        const nuevaResena = new Resena({ producto, comprador, comentario, calificacion });
        await nuevaResena.save();
        res.status(201).json(nuevaResena);
    } catch (error) {
        res.status(500).json({ msg: 'Error al agregar la reseña', detalle: error.message });
    }
};

// Obtener reseñas por producto
export const obtenerResenasPorProducto = async (req, res) => {
    try {
        const resenas = await Resena.find({ producto: req.params.productoId })
            .populate('comprador', 'nombre');
        res.json(resenas);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener reseñas' });
    }
};

// --- Integración con Google Gemini (Analyzer) ---
export const analizarResenasIA = async (req, res) => {
    try {
        const { productoId } = req.params;

        // Buscar todas las reseñas del producto
        const resenasDB = await Resena.find({ producto: productoId });

        if (resenasDB.length === 0) {
            return res.status(404).json({ msg: 'Este producto no tiene reseñas para analizar todavía.' });
        }

        // Extraer solo los textos de los comentarios
        const textosResenas = resenasDB.map(r => r.comentario);

        // Enviar a Gemini para resumir
        const resumenIA = await geminiService.resumirResenasIA(textosResenas);
        res.json({ resumen_inteligente: resumenIA });

    } catch (error) {
        res.status(500).json({ msg: 'Error al conectarse a la IA', detalle: error.message });
    }
};
