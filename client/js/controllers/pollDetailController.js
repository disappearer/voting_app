
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

    $scope.showVoted = false;

    var pollId = $routeParams.pollId;
    $http.get('/polls/' + pollId).success(function(poll){
      $scope.poll = poll;
      $scope.poll.choice = poll.answers[0].id;
    });

    $scope.submit = function(){
      var answerIndex = $scope.poll.choice;
      var voteObj = {
        PollId: pollId,
        AnswerId: $scope.poll.answers[answerIndex].id,
      };
      if($scope.user){
        voteObj.UserId = $scope.user.id;
      }
      $http.post('/polls/' + pollId, voteObj).success(function(data){
        if(data.status === 'success'){
          $scope.poll.answers[answerIndex].votes++;
        } else if (data.status === 'error'){
          $scope.showVoted = true;
        } else {
          console.error('Something went horribly wrong.');
        }
      })
    }
  }]);
