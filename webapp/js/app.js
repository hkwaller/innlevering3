angular.module('TopSecret', ['secret.controllers', 'ui.router', 'ngResource', 'toaster'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    
    $urlRouterProvider.otherwise("/login");

    $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "partials/login.html",
      controller: 'LoginCtrl',
      onEnter: function($state) {
        if (window.sessionStorage.token) {
            $state.go('main')
        }
      }
    })
    
    .state('main', {
      url: "/main",
      templateUrl: "partials/main.html",
      controller: 'MainCtrl',
      onEnter: function($state) {
        if (!window.sessionStorage.token) {
            $state.go('login')
        }
      }
    })
    
    .state('post', {
      url: "/post",
      templateUrl: "partials/post.html",
      controller: 'PostCtrl',
      onEnter: function($state) {
        if (!window.sessionStorage.token) {
            $state.go('login')
        }
      }
    })
})

.run(function($rootScope, $timeout) {
    (function connect() {
        var url = 'ws://localhost:3000';
        var connection = new WebSocket(url);
        
        connection.onclose = function(e) {
            console.log('WebSocket closed. Reconnecting...')
            $timeout(connect, 10*1000);
        }
        
        connection.onmessage = function(e) {
            var payload = JSON.parse(e.data);
            $rootScope.$broadcast('ws:' + payload.topic, payload.data);
        }

        connection.onopen = function() {
            console.log('WebSocket connected..');
        }
        
    })()    
})
