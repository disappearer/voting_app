
angular.module('app.polldetail', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/poll/:pollId', {
        templateUrl: '/views/pollDetail.html',
        controller: 'PollDetailController'
      });
  }])
  .controller('PollDetailController', ['$scope', '$http', '$location', '$routeParams', '$q', 'userFactory', function($scope, $http, $location, $routeParams, $q, userFactory){
    $scope.showVoteAlert = false;
    $scope.showAddOption = false;

    userFactory.userLoggedIn();

    $scope.$watch(function() { return userFactory.getUser() },
                  function(userObj){
                    $scope.user = userObj;
                    $scope.showVoteAlert = false;
                    if($scope.poll) $scope.poll.choice = null;
                  });

    var pollId = $routeParams.pollId;
    $http.get('/polls/' + pollId).then(function(response){
      $scope.poll = response.data;
      $scope.poll.choice = null;
      if($scope.user){
        $scope.showAddOption = $scope.poll.UserId == $scope.user.id;
      }
    }).catch(function(err){
      console.error(err);
    });

    $scope.submit = function(){
      if($scope.poll.choice==null){
        $scope.showVoteAlert = true;
        $scope.voteAlertMessage = 'You haven\'t chosen an answer. Choose wisely.';
        return;
      }
      if(!$scope.customOption && ($scope.poll.choice==$scope.poll.answers.length)){
        $scope.showVoteAlert = true;
        $scope.voteAlertMessage = 'Please enter a custom option.';
        return;
      }

      var answerIndex = $scope.poll.choice;
      var voteObj = {
        PollId: pollId,
        AnswerId: $scope.customOption ? $scope.customOption.text :
                  $scope.poll.answers[answerIndex].id,
      };
      if($scope.user){
        voteObj.UserId = $scope.user.id;
      }
      var sendData = {
        custom: false,
        voteObj: voteObj
      }
      if($scope.customOption){
        sendData.custom = true;
      }

      $http.post('/polls/' + pollId, sendData).success(function(data){
        if(data.status === 'success'){
          if($scope.customOption){
            $scope.poll.answers.push({
              text: $scope.customOption.text,
              votes: 1
            });
          } else {
            $scope.poll.answers[answerIndex].votes++;
          }
          $scope.showVoteAlert = false;
        } else if (data.status === 'error'){
          $scope.showVoteAlert = true;
          $scope.voteAlertMessage = 'You have already voted on this poll.'
        } else {
          $scope.showVoteAlert = true;
          $scope.voteAlertMessage = 'Something went horribly wrong. Initiate evacuation sequence.'
        }
      })
    };
  }]);
