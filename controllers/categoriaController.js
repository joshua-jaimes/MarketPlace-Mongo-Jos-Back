import Categoria from '../models/Categoria.js';

// Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener categorías' });
  }
};

// Crear categoría
export const crearCategoria = async (req, res) => {
  try {
    const categoria = new Categoria(req.body);
    await categoria.save();
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear categoría' });
  }
};

// Obtener categoría por ID
export const obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({ msg: 'Categoría no encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar categoría' });
  }
};

// Actualizar categoría
export const actualizarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!categoria) {
      return res.status(404).json({ msg: 'Categoría no encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar categoría' });
  }
};

// Eliminar categoría
export const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);

    if (!categoria) {
      return res.status(404).json({ msg: 'Categoría no encontrada' });
    }

    res.json({ msg: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar categoría' });
  }
};