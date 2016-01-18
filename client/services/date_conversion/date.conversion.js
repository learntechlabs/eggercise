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

    service.dateToMilli = function (date) {
      // var newDate = new Date(date)
      var convertedDate = new Date(date).getTime();
      return convertedDate;
    };

    //This service is for extracting month and date from the given date format.
    service.getFullDate = function (date) {
      var dateToChange = new Date(date);
      var month = dateToChange.getMonth() + 1;
      var day = dateToChange.getDate();
      var year = dateToChange.getFullYear();
      var monthAndDay = month + '/' + day + '/' + year;

      return monthAndDay;
    };

    service.daysBetween = function (date1, date2) {
      var date1_ms = new Date(date1).getTime();
      var date2_ms = new Date(date2).getTime();
      var dateDifference_ms = date2_ms - date1_ms;
      var dateDifference = service.millisToDays(dateDifference_ms);

      return dateDifference;
    };
    
    return service;
  });