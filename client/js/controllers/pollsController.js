
angular.module('app.polls', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: '/views/polls.html',
        controller: 'PollsController'
      })
  }])
  .controller('PollsController', ['$scope', '$http', function($scope){
    $http.get('/polls').then(function succesCallback(response){
      $scope.polls = response;
    },
    function errorCallback(response){
      $scope.polls = null;
      $scope.err_message = response;
    });
  }]);
