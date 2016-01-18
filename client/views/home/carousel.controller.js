'use strict';

angular.module('eggercise')
  .controller('CarouselDemoCtrl', function ($scope) {
    $scope.myInterval = 4000;
    $scope.slides = [
      {
        image: '../assets/images/MyGroups.png'
      },
      {
        image: '../assets/images/singleGroupPage.png'
      },
      {
        image: '../assets/images/logsPage.png'
      }
    ];
});