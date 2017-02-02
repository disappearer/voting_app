
angular.module('app.newpoll', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/new', {
        templateUrl: '/views/newPoll.html',
        controller: 'NewPollController'
      })
  }])
  .controller('NewPollController', ['$scope', '$http', '$location', 'userLoggedIn', function($scope, $http, $location, userLoggedIn){
    $scope.showNewPollAlert = false;

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
      $scope.showNewPollAlert = false;
      if(!$scope.question){
        $scope.showNewPollAlert = true;
        $scope.newPollAlertMessage = 'Poll question is missing.';
        return;
      }
      $scope.answers.forEach(function(answer){
        if(answer.text===''){
          $scope.showNewPollAlert = true;
          $scope.newPollAlertMessage = 'Please fill all the fields.';
        }
      });
      if($scope.showNewPollAlert){
        return;
      }
      var pollObj = {
        question: $scope.question,
        userid: $scope.user.id,
        answers: $scope.answers
      };
      $http.post('/polls', pollObj).success(function(data){
        $location.path('/poll/' + data.id)
      })
    };

    $scope.removeOption = function(index){
      $scope.answers.splice(index,1);
    };
  }]);
