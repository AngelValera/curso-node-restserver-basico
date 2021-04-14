const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Categoria, Producto, Usuario } = require("../models");

const coleccionesPermitidas = ["categorias", "productos", "roles", "usuarios"];

const buscarCategorias = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const categoria = await Categoria.findById(termino).populate(
			"usuario",
			"nombre",
		);
		return res.json({
			results: categoria ? [categoria] : [],
		});
	}

	const regex = new RegExp(termino, "i");

	const [categorias, count] = await Promise.all([
		Categoria.find({ nombre: regex, estado: true }).populate(
			"usuario",
			"nombre",
		),
		Categoria.count({ nombre: regex, estado: true }),
	]);

	return res.json({
		count,
		results: categorias,
	});
};

const buscarProductos = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const producto = await Producto.findById(termino)
			.populate("usuario", "nombre")
			.populate("categoria", "nombre");
		return res.json({
			results: producto ? [producto] : [],
		});
	}

	const regex = new RegExp(termino, "i");

	const [productos, count] = await Promise.all([
		Producto.find({ nombre: regex, estado: true })
			.populate("usuario", "nombre")
			.populate("categoria", "nombre"),
		Producto.count({ nombre: regex, estado: true }),
	]);

	return res.json({
		count,
		results: productos,
	});
};

const buscarUsuarios = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const usuario = await Usuario.findById(termino);
		return res.json({
			results: usuario ? [usuario] : [],
		});
	}

	const regex = new RegExp(termino, "i");

	const [usuarios, count] = await Promise.all([
		Usuario.find({
			$or: [{ nombre: regex }, { correo: regex }],
			$and: [{ estado: true }],
		}),
		Usuario.count({
			$or: [{ nombre: regex }, { correo: regex }],
			$and: [{ estado: true }],
		}),
	]);

	return res.json({
		count,
		results: usuarios,
	});
};

const buscar = async (req, res = response) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `Las colecciones permitidas son: [ ${coleccionesPermitidas} ]`,
		});
	}

	switch (coleccion) {
		case "categorias":
			buscarCategorias(termino, res);
			break;
		case "productos":
			buscarProductos(termino, res);
			break;
		case "roles":
			break;
		case "usuarios":
			buscarUsuarios(termino, res);
			break;
		default:
			return res.status(500).json({
				msg: `Esta búsqueda no está contemplada, contacte con el desarrollador`,
			});
			break;
	}
};

module.exports = {
	buscar,
};
