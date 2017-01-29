
angular.module('app', ['ngRoute', 'app.polls'])
  .controller('MainController', ['$scope', '$http', '$location', function($scope, $http){
    $http.get('/loggedin').success(function(data){
      $scope.user = data;
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
    }

  }])
  .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
