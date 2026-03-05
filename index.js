
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import ordenRoutes from './routes/ordenRoutes.js';
import resenaRoutes from './routes/resenaRoutes.js';
import preguntaRoutes from './routes/preguntaRoutes.js';

dotenv.config();
conectarDB();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Hacer pública la carpeta de uploads para acceder a las imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración básica de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Marketplace Inteligente API',
            version: '1.0.0',
            description: 'API REST para eCommerce con funciones de IA (Gemini).',
            contact: { name: 'Desarrollador' }
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ["./routes/*.js"], // Le decimos a swagger dónde buscar los comentarios
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/preguntas', preguntaRoutes);

app.get('/', (req, res) => {
    res.send('🚀 Bienvenido a mi API REST con ES Modules, MongoDB e Inteligencia Artificial');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
