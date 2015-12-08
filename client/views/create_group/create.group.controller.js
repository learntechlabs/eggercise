'use strict';

angular.module('eggercise')
	.controller('CreateGroupCtrl', ['$location', '$log', '$routeParams', 'GroupService', function ($location, $log, $routeParams, GroupService) {
		var vm = this;
		    // var creatorId = $routeParams.creatorId;

		    vm.groups = [];
		    vm.formData = {};
		    // vm.formData._creator = creatorId

		    angular.extend(vm, {

		      name: 'CreateGroupCtrl',

		      createGroup: function () {
		      	GroupService.createGroup(vm.formData)
		      		.then(function (data) {
		      			vm.groups.push(data);
		      			vm.formData = {};
		      			$location.path('/group');
		      		})
		      		.catch(function (err) {
		      			vm.error = err;
		      			$log.error('Error: ', err);
		      		});
		      }

		    });
	}]);
