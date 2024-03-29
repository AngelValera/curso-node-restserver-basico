const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignin, renovarToken } = require("../controllers/auth");
const { validarCampos, validarJWT } = require("../middlewares/");

const router = Router();

router.post(
	"/login",
	[
		check("correo", "El correo es obligatorio").isEmail(),
		check("password", "La comtraseña es obligatoria").not().isEmpty(),
		validarCampos,
	],
	login,
);

router.post(
	"/google",
	[
		check("id_token", "El id_token es obligatorio").not().isEmpty(),
		validarCampos,
	],
	googleSignin,
);

router.get("/", validarJWT, renovarToken);

module.exports = router;
