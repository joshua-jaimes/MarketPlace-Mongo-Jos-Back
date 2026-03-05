import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Inicializar la API con la llave provista
console.log("CARGANDO GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "KEY PRESENTE" : "UNDEFINED");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// El modelo recomendado para texto rápido y barato es gemini-1.5-flash
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Genera una descripción atractiva para un producto basándose en su nombre y atributos básicos.
 */
export const generarDescripcionIA = async (nombreProducto, palabrasClaves = '') => {
    try {
        const prompt = `Actúa como un copywriter experto en e-commerce. Genera una descripción atractiva, corta (no más de 3 párrafos) y vendedora para un producto llamado "${nombreProducto}". Contexto adicional/palabras clave: ${palabrasClaves}. Tu respuesta debe ser SOLO la descripción, sin introducciones ni comentarios extras.`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("Error al generar descripción con Gemini:", error);
        throw new Error('No se pudo generar la descripción con Inteligencia Artificial.');
    }
};

/**
 * Sugiere una categoría principal para el producto basándose en su nombre o descripción.
 */
export const sugerirCategoriaIA = async (textoProducto, categoriasDisponibles) => {
    try {
        const categoriasStr = categoriasDisponibles.map(c => `"${c.nombre}"`).join(', ');

        const prompt = `Dada la siguiente descripción o nombre de un producto: "${textoProducto}". 
        Selecciona la categoría más adecuada ÚNICAMENTE de esta lista de categorías disponibles: [${categoriasStr}].
        Tu respuesta debe ser EXACTAMENTE el nombre de la categoría elegida, y nada más. Si no estás seguro, elige la más cercana o devuelve "General".`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("Error al sugerir categoría con Gemini:", error);
        throw new Error('No se pudo sugerir la categoría.');
    }
};

/**
 * Analiza un arreglo de reseñas y devuelve un resumen rápido y el sentimiento general.
 */
export const resumirResenasIA = async (resenasTextoArray) => {
    try {
        if (!resenasTextoArray || resenasTextoArray.length === 0) {
            return "No hay suficientes reseñas para analizar.";
        }

        const textoJunto = resenasTextoArray.join(" | ");
        const prompt = `A continuación te presento un listado de reseñas (separadas por |) que los usuarios dejaron sobre un producto.
        Analiza el sentimiento general y redacta un pequeño párrafo resumen (máximo 4 líneas) resaltando lo que más gustó y lo que menos gustó. 
        Reseñas: ${textoJunto}`;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("Error al resumir reseñas con Gemini:", error);
        throw new Error('Error de la IA al analizar las reseñas.');
    }
};
