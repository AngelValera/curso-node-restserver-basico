// En este fichero podemos tener referenciados todos nuestros middlewares personalizados

const validarArchivos = require("../middlewares/validar-archivo");
const validarCampos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const validarRoles = require("../middlewares/validar-roles");

module.exports = {
	...validarArchivos,
	...validarCampos,
	...validarJWT,
	...validarRoles,
};
