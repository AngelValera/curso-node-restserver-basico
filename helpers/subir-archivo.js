const path = require("path");
const { v4: uuidv4 } = require("uuid");

const extensionesPorDefecto = ["png", "jpg", "jpeg", "gif"];

const subirArchivo = (files, extensionesPermitidas = extensionesPorDefecto, directorio = '') => {
	return new Promise((resolve, reject) => {
		const { archivo } = files;

		const nombreCortado = archivo.name.split(".");
		const extension = nombreCortado[nombreCortado.length - 1];

		// Validar la extension
		if (!extensionesPermitidas.includes(extension)) {
			return reject(
				`La extensión ${extension} no está permitida, [ ${extensionesPermitidas} ]`,
			);
		}

		// Renombrar la imagen con un identificador único
		const nombreTemp = uuidv4() + "." + extension;
		const uploadPath = path.join(
			__dirname,
			"../uploads/",
			directorio,
			nombreTemp,
		);

		archivo.mv(uploadPath, (err) => {
			if (err) {
				return reject( err );
			}
            resolve(nombreTemp);			
		});
	});
};

module.exports = {
	subirArchivo,
};
