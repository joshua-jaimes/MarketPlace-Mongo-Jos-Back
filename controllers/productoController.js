import Producto from '../models/Producto.js';
import * as geminiService from '../services/geminiService.js';
// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate('vendedor', 'nombre correo')
      .populate('categoria', 'nombre');

    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener productos' });
  }
};

// Crear producto
export const crearProducto = async (req, res) => {
  try {
    const data = req.body;

    // Si multer subió un archivo, construimos la URL de la imagen
    if (req.file) {
      data.imagen_url = `/uploads/${req.file.filename}`;
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ msg: 'Error al crear producto', detalle: error.message });
  }
};

// Obtener producto por ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('vendedor', 'nombre correo')
      .populate('categoria', 'nombre');

    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ msg: 'Error al buscar producto' });
  }
};

// Actualizar producto
export const actualizarProducto = async (req, res) => {
  try {
    const data = req.body;

    // Si mandaron una imagen nueva, actualizamos el campo
    if (req.file) {
      data.imagen_url = `/uploads/${req.file.filename}`;
    }

    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar producto' });
  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);

    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    res.json({ msg: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar producto' });
  }
};

// Obtener productos por vendedor
export const obtenerProductosPorVendedor = async (req, res) => {
  try {
    const productos = await Producto.find({ vendedor: req.params.vendedorId })
      .populate('categoria', 'nombre');

    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener productos del vendedor' });
  }
};

// Obtener productos por categoría
export const obtenerProductosPorCategoria = async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: req.params.categoriaId })
      .populate('vendedor', 'nombre correo');

    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener productos por categoría' });
  }
};

// Buscar productos (búsqueda básica por texto)
export const buscarProductos = async (req, res) => {
  try {
    const { q } = req.query;

    const productos = await Producto.find({
      nombre: { $regex: q, $options: 'i' }
    })
      .populate('vendedor', 'nombre correo')
      .populate('categoria', 'nombre');

    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: 'Error en la búsqueda de productos' });
  }
};

// --- Integración AI (Generar Descripción y Sugerir Categoria) ---

export const generarDescripcionIA = async (req, res) => {
  try {
    const { nombre, atributos_claves } = req.body;

    if (!nombre) {
      return res.status(400).json({ msg: 'El nombre del producto es obligatorio para generar la descripción.' });
    }

    const descripcionGenerada = await geminiService.generarDescripcionIA(nombre, atributos_claves);
    res.json({ descripcion: descripcionGenerada });
  } catch (error) {
    res.status(500).json({ msg: 'Error al conectar con la IA', detalle: error.message });
  }
};

import Categoria from '../models/Categoria.js';

export const sugerirCategoriaIA = async (req, res) => {
  try {
    const { textoPrincipal } = req.body;

    if (!textoPrincipal) {
      return res.status(400).json({ msg: 'Se necesita texto descriptivo para buscar la categoría ideal.' });
    }

    // Obtener nombres de las categorías reales de la base de datos
    const categoriasDB = await Categoria.find().select('nombre -_id');

    if (categoriasDB.length === 0) {
      return res.status(400).json({ msg: 'Primero debes crear categorías en tu base de datos para que la IA sugiera una.' });
    }

    const categoriaSugerida = await geminiService.sugerirCategoriaIA(textoPrincipal, categoriasDB);
    res.json({ categoria_sugerida: categoriaSugerida });
  } catch (error) {
    res.status(500).json({ msg: 'Error al sugerir categoría', detalle: error.message });
  }
};