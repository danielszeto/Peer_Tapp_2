console.log('checking');

var app = angular
  .module('peertapp', ['ui.router', 'ngResource', 'satellizer'])
  .controller('MainController', MainController)
  .controller('HomeController', HomeController)
  .controller('LoginController', LoginController)
  .controller('SignupController', SignupController)
  .controller('LogoutController', LogoutController)
  .controller('ProfileController', ProfileController)
  .controller('AllController', AllController)

  .service('Account', Account)
  .config(configRoutes)
  ;
////////////
// ROUTES //
////////////
configRoutes.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"]; // minification protection
function configRoutes($stateProvider, $urlRouterProvider, $locationProvider) {
  //this allows us to use routes without hash params!
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  // for any unmatched URL redirect to /
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'SignupController',
      controllerAs: 'sc',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController',
      controllerAs: 'lc',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('logout', {
      url: '/logout',
      template: null,
      controller: 'LogoutController',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileController',
      controllerAs: 'profile',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('main', {
      url: '/main',
      templateUrl: 'templates/main.html',
      controller: 'AllController',
      controllerAs: 'all',
      resolve: {
        loginRequired: loginRequired
      }
    })
    
    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }
    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }
}
/////////////////
// CONTROLLERS //
/////////////////
// AllController.$inject = ["Account"]; // minification protection
function AllController (Beer, $scope, $rootScope) {
    var vm = this;
    vm.newBeer = {};
    vm.beers = Beer.query();
    vm.createBeer = createBeer;
    vm.updateBeer = updateBeer;
    vm.deleteBeer = deleteBeer;

    // vm.incrementUpvotes = incrementUpvotes;
    // this.newComment ={};
    // this.comments = Comment.query();
    // this.createComment = createComment;
  function updateBeer(beer) {
    console.log('updating3');
      Beer.update({id: beer._id}, beer);
      vm.displayEditForm = false;
    }

  function incrementUpvotes(beer){
      console.log('incrementing');
      beer.upvotes += 1;
      Beer.update({id: beer._id}, beer);
      // console.log(beer.upvotes);
    }

  function createBeer(){
    console.log('incrementing2');
    console.log(vm.newBeer);
        Beer.save(vm.newBeer);
        vm.beers.push(vm.newBeer);
        vm.newBeer = {};
        console.log(vm.newBeer);
        console.log('saved');
   }

  function deleteBeer(beer) {
      console.log("deleting", beer._id);
      Beer.remove({id:beer._id});
      var beersIndex = vm.beers.indexOf(beer);
      vm.beers.splice(beersIndex, 1);
    }
}

app.service('Beer', function($resource) {
  return $resource('http://localhost:3000/api/beers/:id', { id: '@_id' }, {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  });
});

MainController.$inject = ["Account"]; // minification protection
function MainController (Account) {
  var vm = this;
  vm.currentUser = function() {
   return Account.currentUser();
  }
}
HomeController.$inject = ["$http"]; // minification protection
function HomeController ($http) {
  var vm = this;
  vm.posts = [];
  vm.new_post = {}; // form data
  $http.get('/api/posts')
    .then(function (response) {
      vm.posts = response.data;
    });
  vm.createPost = function() {
    $http.post('/api/posts', vm.new_post)
    .then(function (response) {
      vm.new_post = {};
      vm.posts.push(response.data);
    });
  };
  
  vm.deletePost = function(post) {
    $http.delete("/api/posts/" + post._id)
      .then(function(response) {
        var postIndex = vm.posts.indexOf(post);
        vm.posts.splice(postIndex, 1);
      });
  }
}
LoginController.$inject = ["Account", "$location"]; // minification protection
function LoginController (Account, $location) {
  var vm = this;
  vm.new_user = {}; // form data
  vm.login = function() {
    Account
      .login(vm.new_user)
      .then(function(){
         vm.new_user = {};
         $location.path('/profile');
      })
  };
}
SignupController.$inject = ["Account", "$location"]; // minification protection
function SignupController (Account, $location) {
  var vm = this;
  vm.new_user = {}; // form data
  vm.signup = function() {
    Account
      .signup(vm.new_user)
      .then(
        function (response) {
          vm.new_user = {};
          $location.path('/profile')
        }
      );
  };
}
LogoutController.$inject = ["Account", "$location"]; // minification protection
function LogoutController (Account, $location) {
  Account.logout(function() {
    $location.path('/login'); 
  });
}
ProfileController.$inject = ["Account"]; // minification protection
function ProfileController (Account) {
  var vm = this;
  vm.new_profile = {}; // form data
  vm.updateProfile = function() {
    Account
      .updateProfile(vm.new_profile)
      .then(function() {
          console.log("profile controller", vm.new_profile); 
    // On success, clear the form
        vm.showEditForm = false;
      });
  };
// TODO NEED TO DO- user ID is not defined
  vm.deleteProfile = function(currentUser) {
      console.log("Current user id", currentUser); 
    Account.remove({id: currentUser._id});
    var userIndex = vm.users.indexOf(user);
      console.log("user to delete ", user)
    vm.users.splice(userIndex,1);
  }
}
//////////////
// Services //
//////////////
Account.$inject = ["$http", "$q", "$auth", "$rootScope"]; // minification protection
function Account($http, $q, $auth, $rootScope) {
  var self = this;
  self.user = null;
  self.signup = signup;
  self.login = login;
  self.logout = logout;
  self.currentUser = currentUser;
  self.getProfile = getProfile;
  self.updateProfile = updateProfile;

 function signup(userData) {
  console.log("hitting signup")
    // returns a promise
    return (
      $auth
        .signup(userData)
        .then(
          function onSuccess(response) {
            $auth.setToken(response.data.token); // set token 
              // console.log('Auth Token', response.data.token)
              console.log('User Data', userData); 
          },
          function onError(error) {
            console.error(error);
          }
        )
    );
  }
  function login(userData) {
    return (
      $auth
        .login(userData) 
        .then(
          function onSuccess(response) {
            $auth.setToken(response.data.token);
              // console.log("Login Token ", response.data.token); 
              // console.log("UserDataLogin ", userData); 
          },
          function onError(error) {
            console.error(error);
          }
        )
    );
  }
  function logout(cb) {
    // returns a promise!!!
    $auth
      .logout()
      .then(function() {
          console.log("User Id before logout ", self.user); 
        self.user = null;
          console.log("User Id after logout ", self.user); 
          cb();
    })
    // returns a promise!!!
  }
  function currentUser() {
    if ( self.user ) { return self.user; }
    if ( !$auth.isAuthenticated() ) { return null; }
    var deferred = $q.defer();
    getProfile().then(
      function onSuccess(response) {
        self.user = response.data;
          console.log("Current User right now is... ", self.user); 
        deferred.resolve(self.user);
      },
      function onError() {
        $auth.logout();
        self.user = null;
        deferred.reject();
      }
    )
    self.user = promise = deferred.promise;
    return promise;
  }
  function getProfile() {
    return $http.get('/api/me');

  }

  $http({
  method: 'GET',
  url: '/api/me'
    }).then(function successCallback(res) {
    $rootScope.currentUser = res.data._id;

    console.log('this is res', res);
    console.log('this is rootscope', $rootScope);
    console.log('this is the user id', res.data._id);
    // this callback will be called asynchronously
    // when the response is available

});

  function updateProfile(profileData) {
      console.log("profiledata", profileData);
    return (
      $http
        .put('/api/currentUser', profileData)
        .then(
          function (response) {
            self.user = response.data;
              console.log("UPDATED info", self.user); 
          }
        )
    );
  }
}