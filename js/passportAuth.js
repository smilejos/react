var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth.js');

module.exports = {

	passport.serializeUser(function(user, done) {
		console.log(JSON.stringify(user));
		done(null, user);
	});
	 
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	passport.use(new FacebookStrategy({
		clientID: configAuth.Rock.clientID,
		clientSecret: configAuth.Rock.clientSecret,
		callbackURL: configAuth.Rock.callbackURL
	}, 
	function(accessToken, refreshToken, profile, done) {
		  process.nextTick(function() {
		    done(null, profile);
		  });
	}));

}