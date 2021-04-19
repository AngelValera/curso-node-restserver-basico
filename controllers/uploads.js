const path = require('path');
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const {subirArchivo} =require("../helpers");
const { Usuario, Producto } = require('../models');

const cargarArchivo = async(req, res = response) => {
	
	//Textos
	try {
		const nombre = await subirArchivo(req.files, ["md", "txt"], 'textos');
		res.json({ nombre });	
	} catch (error) {
		res.status(400).json({msg:error});
	}
		
};

const actualizarImagen = async (req, res = response) =>{
	const {id, coleccion} = req.params;

	let modelo;

	switch (coleccion) {
		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`,
				});	
			}
			break;
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});	
			}			
			break;
		default:
			return res.status(500).json({
				msg: `Lo que intenta no está contemplado, contacte con el desarrollador`,
			});
			break;
	}

	// Limpiar imagenes previas
	if ( modelo.img ) {
		// Hay que eliminar la imagen del servidor
		const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img );		
		if (fs.existsSync(pathImage)) {
			fs.unlinkSync(pathImage);
		}
	}

	const nombre = await subirArchivo(req.files, undefined, coleccion );
	modelo.img = nombre;
	
	await modelo.save(); 
	
	res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
	
	const {id, coleccion} = req.params;

	let modelo;	
	
	switch (coleccion) {
		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`,
				});	
			}
			break;
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});	
			}			
			break;
		default:
			return res.status(500).json({
				msg: `Lo que intenta no está contemplado, contacte con el desarrollador`,
			});
			break;
	}	

	// Limpiar imagenes previas
	if ( modelo.img ) {
		// Hay que eliminar la imagen del servidor
		const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img );		
		if (fs.existsSync(pathImage)) {
			return res.sendFile(pathImage);
		}
	}	
	const pathNoImage = path.join(__dirname, "../assets/no-image.jpg");		
	return res.sendFile(pathNoImage);
};

const actualizarImagenCloudinary = async (req, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`,
				});
			}
			break;
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({
				msg: `Lo que intenta no está contemplado, contacte con el desarrollador`,
			});
			break;
	}

	// Limpiar imagenes previas
	if (modelo.img) {
		const nombreArr = modelo.img.split('/');
		const nombre = nombreArr[nombreArr.length - 1];
		const [ public_id ] = nombre.split('.');
		
		cloudinary.uploader.destroy(public_id); // No es necesario await 
	}
	const { tempFilePath } = req.files.archivo;
	const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

	modelo.img = secure_url;

	await modelo.save();

	res.json(modelo);
};

module.exports = {
	cargarArchivo,
	actualizarImagen,
	mostrarImagen,
	actualizarImagenCloudinary,
};
