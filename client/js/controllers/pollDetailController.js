
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

    $scope.showVoteAlert = false;

    var pollId = $routeParams.pollId;
    $http.get('/polls/' + pollId).success(function(poll){
      $scope.poll = poll;
    });

    $scope.submit = function(){
      console.log($scope.poll.choice);
      if(!$scope.poll.choice){
        $scope.showVoteAlert = true;
        $scope.voteAlertMessage = 'You haven\'t chosen an answer. Choose wisely.';
        return;
      }
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
          $scope.showVoteAlert = true;
          $scope.voteAlertMessage = 'You have already voted on this poll.'
        } else {
          $scope.showVoteAlert = true;
          $scope.voteAlertMessage = 'Something went horribly wrong. Initiate evacuation sequence.'
        }
      })
    }
  }]);
