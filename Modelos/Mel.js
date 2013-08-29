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

// Creamos nuestro esquema de datos para la coleccion Melate
var melates = new Schema({
	_sorteo:{type: Number, ref: 'sorteos'}
	,Fecha: {type: Date}
	,M1: {type: Number}
	,M2: {type: Number}
	,M3: {type: Number}
	,M4: {type: Number}
	,M5: {type: Number}
	,M6: {type: Number}
	,MA: {type: Number}
	,Macum: {type: Number, get: conComas, set: sinComas}
});

// exportamos el archivo como módulo
module.exports = melates;

