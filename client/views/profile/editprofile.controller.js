'use strict';

angular.module('eggercise')
  .controller('ProfileCtrl', function (EditProfile, $routeParams, $rootScope, $cookieStore, $log, $location) {

    var vm = this;
    vm.user = {};
    vm.formData = {};
    vm.id = $rootScope._id;

    angular.extend(vm, {

    //Edit Profile
    editProfile: function () {
      EditProfile.editProfile(vm.formData)
        .then(function (data) {
          vm.user = data;
          $location.path('/');
        })
      .catch(function (err) {
        vm.error = err;
        $log.error('Error: ', err);
      });
    }
   });
});