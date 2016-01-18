'use strict';

angular.module('eggercise')
  .directive('ngFooter', function () {
    return {
      restrict: 'E',
      templateUrl: 'directives/ng-footer/footer.html'
    };
  });