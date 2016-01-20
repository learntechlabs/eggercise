'use strict';

angular.module('eggercise')
  .controller('LoginCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {

    var vm = this;

    angular.extend(vm, {

      name: 'LoginCtrl',

      /**
       * Login method
       */
      login: function () {
        Auth.login(vm.user)
          .then(function () {
            if ($scope.returnToPath) {
              $location.path($scope.returnToPath);
              $scope.returnToPath = null;
            } else {
              $location.path('/group');
            }
          })
          .catch(function (err) {
            vm.error = err;
          });
      }

    });

  }]);
