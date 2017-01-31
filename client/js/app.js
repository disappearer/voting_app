
angular.module('app', ['ngRoute', 'app.polls', 'app.newpoll', 'app.polldetail'])

  .factory('userLoggedIn', ['$http', function($http){
    return $http.get('/loggedin');
  }])

  .controller('MainController', ['$scope', '$http', '$location', '$window', 'userLoggedIn', function($scope, $http, $location, $window, userLoggedIn){

    userLoggedIn.success(function (user){
      $scope.user = user;
    });

    $scope.signout = function(){
      $http.get('/signout').success(function(data){
        if (data) {
          if (data.status == 'success') {
            $scope.user = null;
            $window.location.reload();
          }
        }
      })
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  }])

  .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
