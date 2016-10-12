(function() {
  'use strict';
  angular.module('app',
    [
      'ionic',
      'ajoslin.promise-tracker',
      'ionic-datepicker',
      'ionic-timepicker'
    ])
    .run(function($ionicPlatform, jpushService) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        //jpushService.init();
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    });
})();

