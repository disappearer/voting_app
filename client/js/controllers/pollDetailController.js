
angular.module('app.polldetail', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/poll/:pollId', {
        templateUrl: '/views/pollDetail.html',
        controller: 'PollDetailController'
      });
  }])
  .controller('PollDetailController', ['$scope', '$http', '$location', '$routeParams', '$q', 'userLoggedIn', function($scope, $http, $location, $routeParams, $q, userLoggedIn){
    $scope.showVoteAlert = false;
    $scope.showAddOption = false;
    $scope.addedOptions = [];

    var pollId = $routeParams.pollId;
    $q.all([
      userLoggedIn,
      $http.get('/polls/' + pollId)
    ]).then(function(results){
      $scope.user = results[0].data;
      $scope.poll = results[1].data;
      $scope.poll.choice = null;
      $scope.showAddOption = $scope.poll.UserId == $scope.user.id;
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
