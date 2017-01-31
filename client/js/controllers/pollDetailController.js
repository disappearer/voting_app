
angular.module('app.polldetail', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/poll/:pollId', {
        templateUrl: '/views/pollDetail.html',
        controller: 'PollDetailController'
      });
  }])
  .controller('PollDetailController', ['$scope', '$http', '$location', '$routeParams', 'userLoggedIn', function($scope, $http, $location, $routeParams, userLoggedIn){
    userLoggedIn.success(function (user){
      $scope.user = user;
    });

    var pollId = $routeParams.pollId;
    $http.get('/polls/' + pollId).success(function(poll){
      $scope.poll = poll;
      $scope.poll.choice = poll.answers[0].id;
    });

    $scope.submit = function(answerId, pollId){
      var voteObj = {
        PollId: pollId,
        AnswerId: answerId,
      };
      if($scope.user){
        voteObj.UserId = user.id;
      }
      $http.post('/polls/' + pollId, pollObj).success(function(data){
        console.log(data);
      })
    }
  }]);
