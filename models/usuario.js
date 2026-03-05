import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    edad: {
        type: Number,
        required: [true, 'La edad es obligatoria']
    },
    rol: {
        type: String,
        enum: ['cliente', 'admin'],
        default: 'cliente'
    }
}, {
    timestamps: true
});

// Middleware para encriptar la contraseña antes de guardar el usuario
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar contraseña
usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
};

export default mongoose.model('Usuario', usuarioSchema);
