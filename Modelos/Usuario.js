// Requerimos a mongoose y declaramos una variable de esquema
var schema = require('mongoose').Schema
, bcrypt = require('bcrypt')
, SALT_WORK_FACTOR = 10
, MAX_LOGIN_ATTEMPTS = 5
, LOCK_TIME = 2 * 60 * 60 * 1000;

//------------------------------------------ESQUEMA------------------------------------------//


// Creamos nuestros esquemas para la colección Usuario
var usuario = new schema({
	Fecha: {type: Date, default: Date.now}
	, Nombre: {type: String, required: true}
	, Apellidop: {type: String, required: true}
	, Apellidom: {type: String, required: true}
	, Usuario: {type: String, required: true, index: {unique: true}}
	, Clave: {type: String, required: true}
	, Email: {type: String, required: true}
	, tod: {type: Boolean, default: false}
	, loginAttempts: {type: Number, required: true, default: 0}
	, lockUntil: {type: Number}
});

//------------------------------------------FUNCIONES------------------------------------------//

usuario.virtual('isLocked').get(function(){
	// Checar el timestamp para futuros lockUntil
	return !!(this.lockUntil && this.lockUntil > Date.now());
});

usuario.pre('save', function(next){
	var user = this;
	// Sólo hash de la contraseña si se ha modificado (o nuevo)
	if(!user.isModified('Clave'))
		return next();
	// generar un salto
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err)
			return next(err);
		// hash de clave usando el nuevo salto
		bcrypt.hash(user.Clave, salt, function(err, hash){
			if(err)
				return next(err);
			// colocamos atras de nuestro documento de usuario la contraseña hash
			user.Clave = hash;
			next();
		});
	});
});

usuario.methods.comparePassword = function(candidatePassword, cb){
	bcrypt.compare(candidatePassword, this.Clave, function(err, isMatch){
		if(err)
			return cb(err);
		cb(null, isMatch);
	});
}

usuario.methods.incLoginAttempts = function(cb){
	// Si tenemos que una cerradura anterior ha caducado, reiniciamos en 1
	if(this.lockUntil && this.lockUntil < Date.now()){
		return this.update({
			$set: {loginAttempts: 1}
			, $unset: {lockUntil: 1}
		}, cb);
	}
	// De lo contrario incrementamos
	var updates = {$inc: {loginAttempts: 1}};
	// Cerrar la cuenta si hemos llegado a intentos máximos y no está cerrada
	if(this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked){
		updates.$set = {lockUntil: Date.now() + LOCK_TIME};
	}
	return this.update(updates, cb);
}

// Exponer enumrado en el modelo y proporcionar una referencia interna conveniente
var reasons = usuario.statics.failedLogin = {
	NOT_FOUND: 0
	, PASSWORD_INCORRECT: 1
	, MAX_ATTEMPTS: 2
}
// Para autenticar
usuario.statics.getAuthenticated = function(username, password, cb ){
	this.findOne({Usuario: username}, function(err, user){
		if(err)
			return cb(err);
		// Asegurese que el usuario existe si es para autenticar
		if(!user)
			return cb(null, null, reasons.NOT_FOUND);

		// Compruebe si la cuenta esta bloqueada actualmente
		if(user.isLocked){
			// Inicio de sesión de incremento sólo intentos si la cuenta ya está bloqueada
			return user.incLoginAttempts(function(err){
				if(err)
					return cb(err);
				return cb(null, null, reasons.MAX_ATTEMPTS);
			});
		}

		// Prueba para una contraseña que empareja si es para autenticar
		user.comparePassword(password, function(err, isMatch){
			if(err)
				return cb(err);

			// Compruebe si la contraseña era un match
			if(isMatch){
				// Si no hay ningún bloqueo o intentos fallidos, devolver al usuario
				if(!user.loginAttempts && !user.lockUntil)
					return cb(null, user);
				// Intentos de reinicio y bloqueo info
				var updates = {
					$set: {loginAttempts: 0}
					, $unset: {lockUntil: 1}
				};
				return user.update(updates, function(err){
					if(err)
						return cb(err);
					return cb(null, user);
				});
			}

			// La contraseña es incorrecta si es para autenticar.
			// Revisamos los intentos de inicio de sesión antes de responder.
			user.incLoginAttempts(function(err){
				if(err)
					return cb(err);
				return cb(null, null, reasons.PASSWORD_INCORRECT);
			});
		});
	});
}

// exportamos el archivo como módulo.
module.exports = usuario;
