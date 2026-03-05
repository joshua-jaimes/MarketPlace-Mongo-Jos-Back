import mongoose from 'mongoose';

const resenaSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'El producto es obligatorio']
    },
    comprador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El comprador es obligatorio']
    },
    comentario: {
        type: String,
        required: [true, 'El comentario es obligatorio'],
        trim: true
    },
    calificacion: {
        type: Number,
        required: [true, 'La calificación es obligatoria'],
        min: [1, 'La calificación mínima es 1'],
        max: [5, 'La calificación máxima es 5']
    }
}, {
    timestamps: true
});

export default mongoose.model('Resena', resenaSchema);
