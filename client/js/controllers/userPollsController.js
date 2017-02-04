
angular.module('app.userpolls', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/userpolls', {
        templateUrl: '/views/userPolls.html',
        controller: 'UserPollsController'
      })
  }])
  .controller('UserPollsController', ['$scope', '$http', '$location', 'userFactory',
    function($scope, $http, $location, userFactory){
      userFactory.userLoggedIn().then(function(){
        // do everything after checking if user is logged in
        $scope.$watch(function() { return userFactory.getUser() },
                      function(userObj){
                        if(!userObj){
                          $location.path('/');
                        } else {
                          $scope.user = userObj;
                        }
                      }
        );

        $http.get('/polls/user').then(function succesCallback(response){
          if(response.data.length==0) $scope.polls = null;
          else $scope.polls = response.data;
        },
        function errorCallback(response){
          $scope.polls = null;
          $scope.err_message = response;
        });
      });


  }]);
