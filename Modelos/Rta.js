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

// Creamos nuestro esquema de datos para la coleccion Revanchitas
var revanchitas = new Schema({
	_sorteo:{type: Number, ref: 'sorteos'}
	,Fecha: {type: Date}
	,T1: {type: Number}
	,T2: {type: Number}
	,T3: {type: Number}
	,T4: {type: Number}
	,T5: {type: Number}
	,T6: {type: Number}
	,Tacum: {type: Number, get: conComas, set: sinComas}
});

// exportamos el archivo como módulo
module.exports = revanchitas;