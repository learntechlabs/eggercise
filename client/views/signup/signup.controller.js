'use strict';

angular.module('eggercise')
  .controller('SignupCtrl', ['$location', 'Auth', function ($location, Auth) {

    var vm = this;

    angular.extend(vm, {

      name: 'SignupCtrl',

      /**
       * Signup
       */
      signup: function () {
        Auth.signup(vm.user)
          .then(function () {
            $location.path('/group');
          })
          .catch(function (err) {
            vm.error = err;
            $location.path('/signup');
          });
      }

    });

  }]);
