
angular.module('app.polls', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: '/views/polls.html',
        controller: 'PollsController'
      })
  }])
  .controller('PollsController', ['$scope', '$http', 'userFactory',
    function($scope, $http, userFactory){
      userFactory.userLoggedIn();
      
      $scope.$watch(function() { return userFactory.getUser() },
                    function(userObj){ $scope.user = userObj });

      $scope.login = function(){
        userFactory.login();
      }

      $http.get('/polls').then(function succesCallback(response){
        if(response.data.length==0) $scope.polls = null;
        else $scope.polls = response.data;
      },
      function errorCallback(response){
        $scope.polls = null;
        $scope.err_message = response;
      });
  }]);
