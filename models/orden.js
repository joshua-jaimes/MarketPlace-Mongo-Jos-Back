import mongoose from 'mongoose';

const ordenSchema = new mongoose.Schema({
    comprador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El comprador es obligatorio']
    },
    total: {
        type: Number,
        required: [true, 'El total es obligatorio'],
        min: [0, 'El total no puede ser negativo']
    },
    estado: {
        type: String,
        enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente'
    }
}, {
    timestamps: true
});

export default mongoose.model('Orden', ordenSchema);