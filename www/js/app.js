(function() {
  'use strict';
  angular.module('app',
    [
      'ionic',
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
        jpushService.init();
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

        if (navigator.connection) {
          var tmptypes = navigator.connection.type;
          if (tmptypes.toUpperCase().indexOf('NONE') > -1 || tmptypes.toUpperCase().indexOf('UNKNOWN') > -1) {
            if (navigator.notification) {
              navigator.notification.confirm(
                '您的设备未开启网络',
                function (buttonIndex) {
                  if (buttonIndex == 1) {
                    if (cordova.plugins.settings) {
                      cordova.plugins.settings.openSetting("wifi", function () { console.log("network setting openning"); }, function () { console.log("open network setting failed"); });
                    }
                  }
                },            // callback to invoke with index of button pressed
                '提示',           // title
                ['开启', '取消']     // buttonLabels
              );
            }
          }
        }
      });
    });
})();

