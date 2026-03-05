import Pregunta from '../models/pregunta.js';
import Producto from '../models/Producto.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Instanciar IA específicamente para este controlador si se necesita contexto directo
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Crear Pregunta
export const crearPregunta = async (req, res) => {
    try {
        const { producto, usuario, pregunta } = req.body;
        const nuevaPregunta = new Pregunta({ producto, usuario, pregunta });
        await nuevaPregunta.save();
        res.status(201).json(nuevaPregunta);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear la pregunta' });
    }
};

// Obtener preguntas de un producto
export const obtenerPreguntasPorProducto = async (req, res) => {
    try {
        const preguntas = await Pregunta.find({ producto: req.params.productoId })
            .populate('usuario', 'nombre');
        res.json(preguntas);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener preguntas' });
    }
};

// --- Integración Google Gemini (Auto-Response Suggestion) ---
export const sugerirRespuestaIA = async (req, res) => {
    try {
        const { preguntaId } = req.params;

        // 1. Buscar la pregunta y poblar el producto para tener contexto
        const preguntaDB = await Pregunta.findById(preguntaId).populate('producto');

        if (!preguntaDB) {
            return res.status(404).json({ msg: 'Pregunta no encontrada' });
        }

        const producto = preguntaDB.producto;
        const textoPregunta = preguntaDB.pregunta;

        // 2. Crear un prompt dándole a Gemini el contexto del producto
        const prompt = `Actúa como el vendedor amable de una tienda online. 
        Un cliente acaba de preguntar lo siguiente: "${textoPregunta}".
        
        Aquí están los detalles de tu producto para que bases tu respuesta:
        - Nombre: ${producto.nombre}
        - Precio: $${producto.precio}
        - Stock disponible: ${producto.stock} unidades
        - Descripción: ${producto.descripcion}

        Redacta una respuesta corta, cortés y útil basada ÚNICAMENTE en la información proporcionada. Si preguntan algo que no está en los detalles, indícalo amablemente.`;

        // 3. Generar respuesta
        const result = await model.generateContent(prompt);
        const repuestaSugerida = result.response.text().trim();

        res.json({ respuesta_sugerida: repuestaSugerida });

    } catch (error) {
        res.status(500).json({ msg: 'Error al conectar con la IA para la respuesta', detalle: error.message });
    }
};
