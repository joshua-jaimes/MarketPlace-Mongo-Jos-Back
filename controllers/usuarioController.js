import Usuario from '../models/usuario.js';
import jwt from 'jsonwebtoken';
export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
};


export const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar el usuario' });
    }
};


export const crearUsuario = async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear usuario', detalle: error.message });
    }
};


export const actualizarUsuario = async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!usuarioActualizado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar' });
    }
};


export const eliminarUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar' });
    }
};

// Autenticar un usuario e iniciar sesión
export const loginUsuario = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ msg: 'El usuario no existe' });
        }

        // Comprobar la contraseña
        if (await usuario.comprobarPassword(password)) {
            // Generar el Token
            const token = jwt.sign(
                { id: usuario._id, rol: usuario.rol },
                process.env.JWT_SECRET || 'supersecreto123',
                { expiresIn: '30d' }
            );

            res.json({
                _id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
                token
            });
        } else {
            return res.status(403).json({ msg: 'La contraseña es incorrecta' });
        }

    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error al iniciar sesión' });
    }
};
