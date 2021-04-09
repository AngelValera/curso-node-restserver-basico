const { response } = require('express');


const usuariosGet = (req, res = response) => {
	
	const { q, nombre='no name', apikey, page=1, limit } = req.query;
	
	res.json({
		msg: "get API - Controlador",
		q,
		nombre,
		apikey,
		page,
		limit
	});
};


const usuariosPut = (req, res) => {
	
	const id = req.params.id;
	
	res.json({
		msg: "put API - Controlador",
		id
	});
};

const usuariosPost = (req, res) => {
	
	const { nombre, edad } = req.body;
	
	res.json({
		msg: "post API - Controlador",
		nombre, 
		edad		
	});
};

const usuariosPatch = (req, res) => {
	res.json({
		msg: "patch API - Controlador",
	});
};

const usuariosDelete = (req, res) => {
	res.json({
		msg: "delete API - Controlador",
	});
};

module.exports = {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosDelete,
	usuariosPatch,
};