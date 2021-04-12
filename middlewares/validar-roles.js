const { response } = require("express");
const jwt = require("jsonwebtoken");
const usuario = require("../models/usuario");
const Usuario = require("../models/usuario");

const esAdminRole = async (req, res = response, next) => {
	// Este middleware se ejecuta despues de otro en el que se obtiene la informacion del jwt
	if (!req.usuario) {
		return res.status(500).json({
			msg: "Se quiere verificar el rol sin validar el token primero",
		});
	}

	const { rol, nombre } = req.usuario;
	if (rol !== "ADMIN_ROLE") {
		return res.status(401).json({
			msg: `${nombre} no es un usuario administrador - No puede hecer esto`,
		});
	}
    next();
};

// recogemos todos los argumentos con el operador ...
const tieneRole = ( ...roles ) => {
	
	return (req, res = response, next) => {
		// Este middleware se ejecuta despues de otro en el que se obtiene la informacion del jwt
		if (!req.usuario) {
			return res.status(500).json({
				msg: "Se quiere verificar el rol sin validar el token primero",
			});
		}

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles [ ${roles} ]`,
            }); 
        }


		next();
	}
};
module.exports = {
	esAdminRole,
    tieneRole
};
