const { validationResult } = require("express-validator");

// Next, funcion que debe ejecutar si todo pasa correctamente
const validarCampos = ( req, res, next ) => {
	
    const errors = validationResult(req);	
    if (!errors.isEmpty()) {
		return res.status(400).json(errors);
	}

    next();

};

module.exports = {
	validarCampos,
};
