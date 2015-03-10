angular.module('gallery.services', [])

.service('AuthService', function ($q, $localstorage, $timeout, $http, CONFIG, $rootScope) {

	return {
		loginUser : function (post_data) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			
			$http.post(CONFIG.base_url + CONFIG.login, post_data, {
				headers: {'Content-Type': 'application/json'}
			}).success(function(data, status, headers, config) {
				if (!data) {
					deferred.reject();
					return;
				}
				
				if (status == 200) {
					var token = data.login.token;
					$rootScope.token = token;
					$localstorage.set('token', token);
					deferred.resolve(data);
				} else {
					deferred.reject(data);
				}
			}).error(function(err) {
				deferred.reject({"why": err});
			});
	
			promise.success = function (fn) {
				promise.then(fn);
				return promise;
			}
			
			promise.error = function (fn) {
				promise.then(null, fn);
				return promise;
			}
			return promise;
		},

		registerUser : function (post_data) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			
			$http.post(CONFIG.base_url + CONFIG.register, post_data, {
				headers: {'Content-Type': 'application/json'}
			}).success(function(data, status, headers, config) {
				if (!data) {
					deferred.reject();
					return;
				}
				
				if (status == 200) {
					var token = data.login.token;
					$rootScope.token = token;
					$localstorage.set('token', token);
					deferred.resolve(data);
				} else {
					deferred.reject(data);
				}
			}).error(function(err) {
				deferred.reject({"why": err});
			})
			
			promise.success = function (fn) {
				promise.then(fn);
				return promise;
			}
			
			promise.error = function (fn) {
				promise.then(null, fn);
				return promise;
			}
			return promise;
		},
		
		logoutUser : function () {
			var deferred = $q.defer();
			var promise = deferred.promise;
			
			$timeout(function () {
				$localstorage.unset('token');
				deferred.resolve('Logged out!');
			}, 0);
			
			// deferred.reject('Wrong credentials.');
			
			promise.success = function (fn) {
				promise.then(fn);
				return promise;
			}
			
			promise.error = function (fn) {
				promise.then(null, fn);
				return promise;
			}
			
			return promise;
		},
		
		isAuthenticated: function () {
			var token = $localstorage.get('token');
			console.log('Checking auth token: ' + token);
			if (typeof token !== 'undefined') {
				return true;
			} else {
				return false;
			}
		}
	}
})

.service('GalleryService', function ($q, $localstorage, $timeout, $http, CONFIG, $rootScope) {
	return {
		getPictures : function () {
			var deferred = $q.defer();
			var promise = deferred.promise;
			
			// $httpProvider.defaults.headers.get = { 'My-Header' : 'value' }
			var token = $localstorage.get('token');
			$http.get(CONFIG.base_url + CONFIG.get_pictures, {
				headers: {
					'Content-Type': 'application/json',
					'X-API-KEY': token
				}
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(err) {
				deferred.reject(err);
			})
	
			promise.success = function (fn) {
				promise.then(fn);
				return promise;
			}
			
			promise.error = function (fn) {
				promise.then(null, fn);
				return promise;
			}
			return promise;
		},
		
		uploadPicture: function (fileURL) {
			var deferred = $q.defer();
			var promise = deferred.promise;
			var token = $localstorage.get('token');
			
			var options = new FileUploadOptions();
			options.fileKey = "picture";
			options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);

			options.headers = {
				'X-API-KEY': token
			};
			
			var params = {};
			options.params = params;

			var ft = new FileTransfer();
			ft.upload(fileURL, encodeURI(CONFIG.base_url + CONFIG.upload_url), function (r) {
				deferred.resolve(r);
			}, function (error) {
				alert("An error has occurred: Code = " + JSON.stringify(error));
				deferred.reject(error);
			}, options);
			
			promise.success = function (fn) {
				promise.then(fn);
				return promise;
			}
			
			promise.error = function (fn) {
				promise.then(null, fn);
				return promise;
			}
			return promise;
		}
	}
});

angular.module('gallery.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
		unset: function(key) {
      delete $window.localStorage[key];
    }
  }
}])

.factory('Camera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}]);