angular.module('TopSecret', ['secret.controllers', 'ui.router', 'ngResource'])

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
    
    $httpProvider.interceptors.push('authInterceptor');

})

.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});