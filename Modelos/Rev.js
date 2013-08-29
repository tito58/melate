// Requerimos a mongoose y declaramos una variable de esquema
var Schema = require('mongoose').Schema;

//------------------------------------------FUNCIONES------------------------------------------//

function conComas(val)
{
	if(val != undefined){
		// redondeo el número a dos decimales
		var num=val.toFixed(2);
		// coloco comas a la parte entera
		return num.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
	}
}

function sinComas(val)
{
	// quito las comas a la parte entera
	return val.replace(/,/g, "");
}

//------------------------------------------ESQUEMA------------------------------------------//

// Creamos nuestro esquema de datos para la coleccion Revancha
var revanchas = new Schema({
	_sorteo:{type: Number, ref: 'sorteos'}
	,Fecha: {type: Date}
	,R1: {type: Number}
	,R2: {type: Number}
	,R3: {type: Number}
	,R4: {type: Number}
	,R5: {type: Number}
	,R6: {type: Number}
	,Racum: {type: Number, get: conComas, set: sinComas}
});

// exportamos el archivo como módulo
module.exports = revanchas;