angular.module('gallery', ['ionic', 'gallery.controllers', 'gallery.services', 'gallery.utils', 'gallery.config', 'gallery.directives', 'gallery.filters'])

.run(function($ionicPlatform, $rootScope, $state, AuthService) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
	
	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
		var authRequired = toState.data && toState.data.authRequired;
		if (authRequired && !AuthService.isAuthenticated()) {
			event.preventDefault();
			$state.transitionTo("login");
		}
	});
	

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

	.state('login', {
    url: "/login",
		templateUrl: "templates/login.html",
		controller: 'LoginCtrl'
  })
	
	.state('register', {
    url: "/register",
		templateUrl: "templates/register.html",
		controller: 'RegisterCtrl'
  })
	
	.state('logout', {
    url: "/logout",
		cache: false,
		templateUrl: "",
		controller: 'LogoutCtrl'
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl',
		data: {
			authRequired: true
		}
  })

  .state('app.upload', {
    url: "/upload",
    views: {
      'menuContent': {
        templateUrl: "templates/upload.html",
				controller: 'UploadCtrl'
      }
    }
  })
	
	.state('app.pictures', {
		url: "/pictures",
		cache: false,
		views: {
			'menuContent': {
				templateUrl: "templates/pictures.html",
				controller: 'PicturesCtrl'
			}
		}
	})

  .state('app.single', {
    url: "/pictures/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  })
	
	.state("otherwise", {
		url : "*path",
		template : "",
		controller : ['$state', function ($state) {
				$state.go('app.pictures')
			}
		]
	});

  // $urlRouterProvider.otherwise('/app/pictures');
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push(function ($timeout, $injector) {
    var loginModal, $http, $state;

    return {
      responseError: function (rejection) {
        if (rejection.status !== 401) {
          return rejection;
        }

				$state.go('login');
      }
    };
  });
});