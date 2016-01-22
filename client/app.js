'use strict';

angular.module('eggercise', [
  'ngRoute',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngMessages',
  'ui.bootstrap',
  'ngAnimate',
  'angular-toasty'
])

// only display home.js if the user is not logged in
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
        if (response.status === 401) {
          $location.path('/login');
          $cookieStore.remove('token');
          return $q.reject(response);
        }
         else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {

    $rootScope.Auth = Auth;

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      var requestedPath = $location.url();
      var publicPages = [/\//, /\/login/, /\/invites\/accept\/$/];
      var restrictedPage = publicPages.indexOf(requestedPath) === -1;

      !Auth.isReadyLogged()
      .then(function() {
        $rootScope.unauthorized = true;
        publicPages.forEach(function(publicPage, index, publicPages) {
          if (requestedPath === publicPage) {
            $location.path(publicPage)
          }
        })
      })
      .catch(function () {
        $rootScope.unauthorized = false;
      })
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
