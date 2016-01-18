'use strict';

angular.module('eggercise', [
  'ngRoute',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap',
  'ngAnimate',
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

  })
  .factory('authInterceptor',
  function ($rootScope, $q, $cookieStore, $location) {
    return {

      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      responseError: function (response) {
        console.log('response.status: ', response.status);
        if (response.status === 401) {
          console.log('responseError going to login');
          $location.path('/login');
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          $location.path('/');
          return $q.reject(response);
        }
      }

    };
  })
  .run(function ($rootScope, $location, Auth) {

    $rootScope.Auth = Auth;

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      var requestedPath = $location.url();
      var publicPages = ['/', '/login', '/signup'];
      var restrictedPage = publicPages.indexOf(requestedPath) === -1;

      if (restrictedPage) {
        Auth.isReadyLogged()
        .then(function() {
          $rootScope.unauthorized = false;
        })
        .catch(function () {
          $rootScope.unauthorized = true;
          event.preventDefault();
          $rootScope.returnToPath = $location.url();
          $location.path('/login');
        });
      }
    });
  })

  .run(function ($rootScope, $location) {

    $rootScope.$on('$locationChangeStart', function() {
      $rootScope.previousPage = location.pathname;
    });

    $rootScope.back = function () {
      $location.path($rootScope.previousPage);
    };
  });
