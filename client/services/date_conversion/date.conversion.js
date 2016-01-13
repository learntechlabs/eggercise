'use strict';

angular.module('eggercise')
  .service('DateService', function () {
    var service = {};

    service.millisToDays = function (date) {
      //multiplier for milliseconds to days conversion 
      var conversionConst = 1000*60*60*24;

      //date in milliseconds
      var dateToMilli = new Date(date)

      //date in milliseconds to number of days
      var convertedDate = Math.floor(dateToMilli/conversionConst);

      return convertedDate;

    };
    return service;
  });