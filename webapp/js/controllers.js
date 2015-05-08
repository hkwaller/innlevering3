angular.module('secret.controllers', [])

.controller('LoginCtrl', ['$scope', '$http', '$animate', '$window', '$location', '$rootScope', function($scope, $http, $animate, $window, $location, $rootScope) {
  
  $scope.login = function(user) {
    $http.post('/authenticate', {username: user.username, password: user.password})
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token;
        $rootScope.username = user.username;
        $location.path('/main');
      })
      .error(function (data, status, headers, config) {
        delete $window.sessionStorage.token;
      });
  }
  
  $scope.signup = function(user) {
		var newUser = {
			username: user.username,
			password: user.password
		};

		$http.post('/signUp', newUser)
            .success(function(user) {
                $scope.user = {
                    "username":"",
                    "password":""
                }
            })
            .error(function() {
                console.log('Something went wrong');
            });
	};
}])
    
.controller('MainCtrl', ['$scope', '$window', '$location', '$resource', function($scope, $window, $location, $resource) {    
    $scope.logout = function() {
        delete $window.sessionStorage.token;
        $location.path('/');
    }
    
    var Posts = $resource('http://localhost:3000/api/posts');

    $scope.posts = [];

    Posts.query(function(results) {
        console.log(results);
        $scope.posts = results;
    });
    
    $scope.postController = false;
    
    $scope.$on('ws:new_secret', function(_, secret) {
        $scope.$apply(function() {
            $scope.posts.unshift(secret);
        })
    });
    
    $scope.delete = function(post) {
        Posts.remove({id: post._id}, function() {
            for (var i = 0; i < $scope.posts.length; i++) {
                if (post._id === $scope.posts[i]._id) {
                    $scope.posts.splice(i, 1);
                }
            }
       });
    }
    
    $scope.edit = function(post) {
        $location.path('#/post/');
    }
}])
    
.controller('PostCtrl', ['$scope', '$resource', '$rootScope', '$location', function($scope, $resource, $rootScope, $location) {    
    $scope.postController = true;
    
    var Post = $resource('http://localhost:3000/api/posts');

    $scope.submit = function(post) {
        var submitPost = new Post();
        submitPost.title = post.title;
        submitPost.text = post.text;
        submitPost.public = post.public;
        submitPost.username = $rootScope.username;
        submitPost.$save();
    }
}])