var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var secret = "supersecret"
var User = require('../models/user')

module.exports.authenticate = function(req, res) {
    var user = req.body;
    var token = jwt.sign(user, secret, {});
    res.json({ token: token });
}

module.exports.signUp = function(req, res) {
    
    var newUser = req.body;
	var hash = bcrypt.hashSync(newUser.password, 10);
    
    User.findOne({username: newUser.username}, function(err, user) {
		if (user) {
			return res.status('401').send('Username already exists');
		} else {
			var user = new User({
				username: newUser.username,
				passwordHash: hash
			});

			user.save(function() {
				return res.status(201).send(user);
			});
		}
	});
}