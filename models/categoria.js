import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        default: ''
    },
    imagen_icono: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model('Categoria', categoriaSchema);