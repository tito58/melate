var bd = require('../bd/baseDeDatos');

//Exportamos una función que recibe como parámetro el app que se pasó
//donde se requirió la ruta (app.js).
module.exports = function(app){

//-----------------FUNCIONES----------------//

//-----------------VISTAS----------------//

	// Ruta para desplegar la página de inicio
	app.get('/', function(req, res){
		res.render('index', { title: 'Pronosticar números' });
	});


}

