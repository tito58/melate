// Requerimos a mongoose y declaramos una variable de esquema
var Schema = require('mongoose').Schema;

//------------------------------------------FUNCIONES------------------------------------------//

function conFechas(val)
{
	var mes = val.getMonth()+1
	, dia = val.getDate()
	, anno = val.getFullYear();

	if(mes < 10)
		mes = "0" + mes;
	if(dia < 10)
		dia = "0" + dia;

	return mes + "/" + dia + "/" + anno;
}

function conComas(val)
{
	if(val != undefined){
		// redondeo el número a dos decimales
		var num = val.toFixed(2);
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


// Creamos nuestros esquemas para la colección sorteos
var sorteos = new Schema({
	_id: {type: Number, required: true}
	,Fecha: {type: Date, default: Date.now, get: conFechas}
	,Acum: {type: Number, get: conComas, set: sinComas}
	,Premio: {type: Number, get: conComas, set: sinComas}
	, melates : [{ type: Schema.Types.ObjectId, ref: 'melates' }]
	, revanchas : [{ type: Schema.Types.ObjectId, ref: 'revanchas' }]
	, revanchitas : [{ type: Schema.Types.ObjectId, ref: 'revanchitas' }]
});

// exportamos el archivo como módulo.
module.exports = sorteos;


