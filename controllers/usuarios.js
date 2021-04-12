const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");

const usuariosGet = async (req, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { estado: true };
	// Con el objetivo de acelerar el tiempo de respuesta,
	// Ejecutamos ambas promesas al mismo tiempo ya que una
	// no depende de la otra.
	const [total, usuarios] = await Promise.all([
		Usuario.countDocuments(query),
		Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
	]);

	res.json({
		total,
		usuarios,
	});
};

const usuariosPut = async (req, res) => {
	const { id } = req.params;
	const { _id, password, google, correo, ...resto } = req.body;

	// Validar contra BD
	if (password) {
		// Encriptar la contraseña
		const salt = bcryptjs.genSaltSync(); // por defecto son 10 "vueltas"
		resto.password = bcryptjs.hashSync(password, salt);
	}

	const usuario = await Usuario.findByIdAndUpdate(id, resto);

	res.json(usuario);
};

const usuariosPost = async (req, res) => {
	const { nombre, correo, password, rol } = req.body;
	const usuario = new Usuario({ nombre, correo, password, rol });

	// Encriptar la contraseña
	const salt = bcryptjs.genSaltSync(); // por defecto son 10 "vueltas"
	usuario.password = bcryptjs.hashSync(password, salt);

	// Guardar en la BD
	await usuario.save();

	res.json(usuario);
};

const usuariosPatch = (req, res) => {
	res.json({
		msg: "patch API - Controlador",
	});
};

const usuariosDelete = async (req, res) => {
	const { id } = req.params;

	// Eliminar físicamente
	//const usuario = await Usuario.findByIdAndDelete(id); // No se recomienda

	// Eliminar lógicamente
	// Manera recomendada para mantener integridad referencial
	const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
	res.json(usuario);
};

module.exports = {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosDelete,
	usuariosPatch,
};
