
angular.module('app', ['ngRoute', 'app.polls', 'app.newpoll'])

  .factory('userLoggedIn', ['$http', function($http){
    return $http.get('/loggedin');
  }])

  .controller('MainController', ['$scope', '$http', '$location', 'userLoggedIn', function($scope, $http, $location, userLoggedIn){

    userLoggedIn.success(function (user){
      $scope.user = user;
    });

    $scope.signout = function(){
      $http.get('/signout').success(function(data){
        if (data) {
          if (data.status == 'success') {
            $scope.user = null;
            $location.path('/');
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
