
angular.module('app.polls', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: '/views/polls.html',
        controller: 'PollsController'
      })
  }])
  .controller('PollsController', ['$scope', '$http', function($scope, $http){
    $http.get('/polls').then(function succesCallback(response){
      if(response.data.length==0) $scope.polls = null;
      else $scope.polls = response.data;
    },
    function errorCallback(response){
      $scope.polls = null;
      $scope.err_message = response;
    });
  }]);