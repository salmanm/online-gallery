angular.module('gallery.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {})

.controller('PicturesCtrl', function ($scope, GalleryService, CONFIG, $ionicModal) {
	$scope.pictures = [];
	
	GalleryService.getPictures().success(function (data) {
		$scope.pictures = data;
		
		for (var i = 0; i < $scope.pictures.length; i += 1) {
			$scope.pictures[i].path = CONFIG.base_url + CONFIG.pictures + $scope.pictures[i].file_name + $scope.pictures[i].ext;
		}
	});
	
	$ionicModal.fromTemplateUrl('templates/picture-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(pic) {
		$scope.selected_picture = pic;
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})

.controller('LoginCtrl', function ($scope, AuthService, $ionicPopup, $state, $ionicHistory, $ionicLoading, MSG) {
	$scope.data = {};

	$scope.login = function (form) {
		if (!form.$valid) {
			return;
		}

		AuthService.loginUser($scope.data).success(function (data) {
			$ionicHistory.nextViewOptions({
				disableBack : true
			});
			$state.go('app.pictures');
			$ionicLoading.show({ template: 'Logged in!', noBackdrop: true, duration: 2000 });
		}).error(function (data) {
			if (!data) data = {};
			var err = MSG[data.why] || MSG['default'];
			$ionicLoading.show({ template: err, noBackdrop: true, duration: 2000 });
		});
	}
})

.controller('UploadCtrl', function ($scope, AuthService, $ionicPopup, $state, $ionicHistory, $ionicLoading, Camera, GalleryService, $timeout) {
	$scope.image = {};

	$scope.uploadPhoto = function() {
		GalleryService.uploadPicture($scope.image.src).success(function (data) {
			$ionicLoading.show({template: 'Picture uploaded', noBackdrop: true, duration: 2000});
			$timeout(function () {
				$state.go('app.pictures');
			}, 500);
		});
	};
	
	$scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
			$scope.image.src = imageURI;
    }, function(err) {
      console.err(err);
    });
  };

})

.controller('RegisterCtrl', function ($scope, AuthService, $ionicPopup, $state, $ionicHistory, $ionicLoading, MSG) {
	$scope.data = {};
	
	$scope.register = function (form) {
		if (!form.$valid) {
			return;
		}
		
		AuthService.registerUser($scope.data).success(function (data) {
			$ionicHistory.nextViewOptions({
				disableBack : true
			});
			$state.go('app.pictures');
			$ionicLoading.show({ template: 'Welcome!', noBackdrop: true, duration: 2000 });
		}).error(function (data) {
			if (!data) data = {};
			var err = MSG[data.why] || MSG['default'];
			$ionicLoading.show({ template: err, noBackdrop: true, duration: 2000 });
		});
	}
})

.controller('LogoutCtrl', function ($scope, AuthService, $ionicPopup, $state, $ionicHistory, $ionicLoading) {
	AuthService.logoutUser().then(function (data) {
		$state.go('login');
		$ionicLoading.show({ template: 'Logged out!', noBackdrop: true, duration: 2000 });
	});
})