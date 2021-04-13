const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const { removeListener } = require("../models/usuario");

const login = async (req, res = response) => {
	const { correo, password } = req.body;

	try {
		const usuario = await Usuario.findOne({ correo });
		// Verificar si el email existe
		if (!usuario) {
			res.status(400).json({
				msg: "Usuario / Password no son correctos - correo",
			});
		}
		// Verificar si el usuario está activo
		if (!usuario.estado) {
			res.status(400).json({
				msg: "Usuario / Password no son correctos - estado:false",
			});
		}
		// Verificar la contraseña
		const validPassword = bcryptjs.compareSync(password, usuario.password);
		if (!validPassword) {
			res.status(400).json({
				msg: "Usuario / Password no son correctos - password",
			});
		}

		// Generar el JWT
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "Hable con el administrador",
		});
	}
};

const googleSignin = async (req, res = response) => {
	const { id_token } = req.body;
	
	try {
		const { nombre, img, correo } = await googleVerify(id_token);		
		
		let usuario = await Usuario.findOne({ correo });
		
		 if (!usuario) {			
			// Si el usuario no existe hay que crearlo
			const data = {
				nombre,
				correo,
				password:':P',
				img,				
				google:true,				
			};			
			usuario = new Usuario(data);
			await usuario.save();			
		}
		
		// Si el usuario ya existe hay que ver si está como "eliminado"
		if (!usuario.estado) {
			res.status(401).json({
				msg: "Hable con el administrador, usuario bloqueado",
			});
		}
		// Generar el JWT
		const token = await generarJWT( usuario.id );
 
		res.json({
			usuario,
			token
		});
	} catch (error) {
		res.status(400).json({
			msg: "Token de google no es válido",
		});
	}
};

module.exports = {
	login,
	googleSignin,
};
