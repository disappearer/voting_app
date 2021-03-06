
angular.module('votingApp', ['ngRoute', 'app.polls', 'app.newpoll', 'app.polldetail', 'app.userpolls'])

  .factory('userFactory', ['$http', '$window', '$interval', function($http, $window, $interval){
    var user = null;

    function login(){
      var left = screen.width/2 - 200
          , top = screen.height/2 - 250
          , popup = $window.open('/login', '', "top=" + top + ",left=" + left + ",width=400,height=500")
          , interval = 1000;

      popup.authorized = false;

      var i = $interval(function(){
        try {
          if(popup.authorized){
            $interval.cancel(i);
            user = popup.user;
            popup.close();
          }
        } catch(e){
          console.error(e);
        }
      }, interval);
    }

    function logout(){
      $http.get('/signout').success(function(data){
        if (data) {
          if (data.status == 'success') {
            user = null;
          }
        }
      })
    }

    function userLoggedIn(){
       return $http.get('/loggedin').success(function(data){
        user = data;
        return Promise.resolve();
      });
    }

    function getUser(){
      return user;
    }

    return {
      login: login,
      logout: logout,
      userLoggedIn: userLoggedIn,
      getUser: getUser
    }
  }])

  .controller('MainController', ['$scope', '$http', '$location', '$window', '$interval', 'userFactory', function($scope, $http, $location, $window, $interval, userFactory){

    userFactory.userLoggedIn();

    $scope.$watch(function() { return userFactory.getUser() },
                  function(userObj){ $scope.user = userObj });

    $scope.logout = function(){
      userFactory.logout();
    }

    $scope.login = function(){
      userFactory.login();
    }

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  }])

  .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
