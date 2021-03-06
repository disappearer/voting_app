
angular.module('app.userpolls', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/userpolls', {
        templateUrl: '/views/view.user.poll.list.html',
        controller: 'UserPollsController'
      })
  }])
  .controller('UserPollsController', ['$scope', '$http', '$location', 'userFactory', 'spinnerService',
    function($scope, $http, $location, userFactory, spinnerService){
      $scope.loading = true;
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
          $scope.loading = false;
          spinnerService.hide('listSpinner');
        },
        function errorCallback(response){
          $scope.polls = null;
          $scope.err_message = response;
        });
      });


  }]);
