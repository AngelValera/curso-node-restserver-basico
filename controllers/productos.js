const { response } = require("express");
const { Producto, Categoria } = require("../models");

const obtenerProductos = async (req, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { estado: true };
	const [total, productos] = await Promise.all([
		Producto.countDocuments(query),
		Producto.find(query)
			.populate("usuario", "nombre")
			.populate("categoria", "nombre")
			.skip(Number(desde))
			.limit(Number(limite)),
	]);
	res.json({
		total,
		productos,
	});
};

const obtenerProducto = async (req, res = response) => {
	const { id } = req.params;    
	const producto = await Producto.findById(id)
		.populate("usuario", "nombre")
		.populate("categoria", "nombre");   	
    res.json(		
		producto
    ); 	
};

const crearProducto = async (req, res = response) => {
	const nombre = req.body.nombre.toUpperCase();
	const nombreCategoria = req.body.categoria.toUpperCase();

	const [{ _id: categoria }, productoDB] = await Promise.all([
		Categoria.findOne({ nombre: nombreCategoria }),
		Producto.findOne({ nombre }),
	]);

	if (productoDB) {
		return res.status(400).json({
			msg: `El producto ${productoDB.nombre}, ya existe.`,
		});
	}

	// Generar la data a guardar
	const data = {
		nombre,
		categoria,
		usuario: req.usuario._id,
	};

	const producto = await Producto(data);

	// Guardar en la BD
	await producto.save();
	res.status(201).json(producto);
};

const actualizarProducto = async (req, res = response) => {
	const { id } = req.params;
	const { _id, estado, usuario, disponible, ...data } = req.body;	            
    const { _id: categoria } = await Categoria.findOne({
			nombre: data.categoria.toUpperCase(),
		});
    data.nombre = data.nombre.toUpperCase();  	   
    data.usuario = req.usuario._id;    
    data.categoria = categoria;

	const producto = await Producto.findByIdAndUpdate(id, data, { new: true } );
	res.json(producto); 	
};

const borrarProducto = async (req, res = response) => {
	const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false });
	res.json(productoBorrado); 	
};

module.exports = {
	actualizarProducto,
	borrarProducto,
	crearProducto,
	obtenerProducto,
	obtenerProductos,
};
