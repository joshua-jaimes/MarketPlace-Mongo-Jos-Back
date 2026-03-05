import mongoose from 'mongoose';

const preguntaSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'El producto es obligatorio']
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario que pregunta es obligatorio']
    },
    pregunta: {
        type: String,
        required: [true, 'La pregunta es obligatoria'],
        trim: true
    },
    respuesta: {
        type: String,
        default: '' // Será llenado por el vendedor o sugerido por la IA
    }
}, {
    timestamps: true
});

export default mongoose.model('Pregunta', preguntaSchema);
