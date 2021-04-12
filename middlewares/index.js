// En este fichero podemos tener referenciados todos nuestros middlewares personalizados

const validarCampos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const validarRoles = require("../middlewares/validar-roles");

module.exports = {
	...validarCampos,
	...validarJWT,
	...validarRoles,
};
