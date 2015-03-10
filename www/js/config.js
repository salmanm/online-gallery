var config_data = {
	"CONFIG" : {
		'base_url' : 'http://128.199.71.85:3000',
		// 'base_url' : 'http://localhost:3000',
		'login' : '/auth/login',
		'logout' : '/auth/logout',
		'register' : '/auth/register',
		'get_pictures' : '/gallery/',
		'pictures' : '/pictures/',
		'upload_url': '/gallery/'
	},
	
	"MSG": {
		"invalid-password": "Invalid password",
		"user-not-found": "No such user found",
		"nick-exists": "User already exists",
		"email-exists": "Email already registered",
		"default": "Some error occured"
	}
}

var config_module = angular.module('gallery.config', []);

angular.forEach(config_data, function (key, value) {
	config_module.constant(value, key);
});