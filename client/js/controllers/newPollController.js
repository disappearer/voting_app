
angular.module('app.newpoll', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/new', {
        templateUrl: '/views/newPoll.html',
        controller: 'NewPollController'
      })
  }])
  .controller('NewPollController', ['$scope', '$http', '$location', 'userLoggedIn', function($scope, $http, $location, userLoggedIn){
    userLoggedIn.success(function (user){
      if(!user){
        // unauthenticated users forbidden
        $location.path('/');
      }
      $scope.user = user;
    });

    $scope.answers = [{text: '', votes: 0}, {text: '', votes: 0}]

    $scope.addAnswer = function(){
      $scope.answers.push({text: '', votes: 0});
    }

    $scope.submit = function() {
      var pollObj = {
        question: $scope.question,
        userid: $scope.user.id,
        answers: $scope.answers
      };
      $http.post('/polls', pollObj).success(function(data){
        $location.path('/')
      })
    };
  }]);
