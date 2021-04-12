const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
	esRolValido,
	emailExiste,
	existeUsuarioPorId,
} = require("../helpers/db-validators");
const {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosPatch,
	usuariosDelete,
} = require("../controllers/usuarios");

const router = new Router();

router.get("/", usuariosGet);

router.put(
	"/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeUsuarioPorId),
		check("rol").custom(esRolValido),
		validarCampos,
	],
	usuariosPut,
);

router.post(
	"/",
	[
		check("nombre", "El nombre no es válido").not().isEmpty(),
		check("password", "El password debe tener más de 6 caracteres").isLength({
			min: 6,
		}),
		check("correo", "El correo no es válido").isEmail(),
		check("correo").custom(emailExiste),
		//check("rol", "No es un rol válido").isIn(["ADMIN_ROLE","USER_ROLE"]),
		check("rol").custom(esRolValido), // similar a check("rol").custom(  (rol) => esRolValido(rol) )
		validarCampos,
	],
	usuariosPost,
);

router.patch("/", usuariosPatch);

router.delete(
	"/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeUsuarioPorId),
		validarCampos,
	],
	usuariosDelete,
);

module.exports = router;
