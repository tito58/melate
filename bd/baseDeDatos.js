
// Requerimos a mongoose y nodemailer
var mongoose = require("mongoose")
  , nodemailer = require('nodemailer')
  , bcrypt = require('bcrypt');

// Abrimos la base de datos Pronosticos
var pron_lnk = 'mongodb://localhost/Pronosticos'
	, dbPron = mongoose.createConnection(pron_lnk, function(err){
		if(err)
			throw err;
		console.log("Conectado a mongoDB");
	});

// Requerimos el modelo de usuarios y declaramos la colección
var usuModel = require('../modelos/Usuario')
	, usuarios = dbPron.model('usuarios', usuModel);

// Requerimos el modelo de Steos y declaramos la colección
var steosModel = require('../modelos/Steos')
	, sorteos = dbPron.model('sorteos', steosModel);

// Requerimos el modelo de Mel y declaramos la colección
var melModel = require('../modelos/Mel')
	, melates = dbPron.model('melates', melModel);

// Requerimos el modelo de Rev y declaramos la colección
var revModel = require('../modelos/Rev')
	, revanchas = dbPron.model('revanchas', revModel);

// Requerimos el modelo de Rta y declaramos la colección
var rtaModel = require('../modelos/Rta')
	, revanchitas = dbPron.model('revanchitas', rtaModel);

//----------------FUNCIONES----------------//

//----------------CONSULTAS AL SERVIDOR----------------//

