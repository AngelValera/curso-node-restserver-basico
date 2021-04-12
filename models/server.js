const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT || 3000;
        this.usuariosPath = "/api/usuarios";

		// Conectar a base de datos
		this.conectarDB();
		
		// Middlewares
		this.middlewares();

		// Rutas de mi aplicacion
		this.routes();
	}

	async conectarDB(){
		await dbConnection();
	}

	routes() {
		
        this.app.use( this.usuariosPath, require('../routes/usuarios'))
	}

	middlewares() {
		
        // Cors
		this.app.use(cors());

        // Lectura y parseo del body
        this.app.use( express.json() );

		// Directorio Público
		this.app.use(express.static("public"));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`Example app listening at http://localhost:${this.port}`);
		});
	}
}

module.exports = Server;
