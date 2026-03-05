import Orden from '../models/Orden.js';

// Obtener todas las órdenes
export const obtenerOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find()
      .populate('usuario')
      .populate('productos.producto');

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener órdenes' });
  }
};

// Crear orden
export const crearOrden = async (req, res) => {
  try {
    const orden = new Orden(req.body);
    await orden.save();
    res.status(201).json(orden);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear orden' });
  }
};

// Obtener orden por ID
export const obtenerOrdenPorId = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id)
      .populate('usuario')
      .populate('productos.producto');

    if (!orden) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    res.json(orden);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar orden' });
  }
};

// Eliminar orden
export const eliminarOrden = async (req, res) => {
  try {
    const orden = await Orden.findByIdAndDelete(req.params.id);

    if (!orden) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    res.json({ msg: 'Orden eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar orden' });
  }
};

// Obtener órdenes por usuario
export const obtenerOrdenesPorUsuario = async (req, res) => {
  try {
    const ordenes = await Orden.find({ usuario: req.params.usuarioId })
      .populate('productos.producto');

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener órdenes del usuario' });
  }
};

// Actualizar estado de orden
export const actualizarEstadoOrden = async (req, res) => {
  try {
    const orden = await Orden.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    );

    if (!orden) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    res.json(orden);
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar estado de la orden' });
  }
};