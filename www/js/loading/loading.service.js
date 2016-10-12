/**
 * Created by wangll on 2016/10/12.
 */
(function() {
  'use strict';
   angular.module('app')
     .service('loading', loadingService);

  loadingService.$inject = ['$ionicLoading', '$timeout', '$ionicPopup'];

  function loadingService($ionicLoading, $timeout, $ionicPopup) {
    var _show = function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="android" class="spinner-calm"></ion-spinner><br/>数据加载中，请稍候',
        noBackDrop: true
      });
    };

    var _hide = function(text, type) {
      $timeout(function(){$ionicLoading.hide();},400)
        .then(_alert(text, type));
    };
    var successAlert = {
      'okText': '好的',
      'okType': 'button-balanced'
    };
    var errorAlert = {
      'okText': '好的',
      'okType': 'button-danger'
    }
    var _alert = function(text, type) {
      if (text && type) {
        if (type == 'error') {
          errorAlert.title = text;
          $ionicPopup.alert(errorAlert);
        }
        else {
          successAlert.title = text;
          $ionicPopup.alert(successAlert);
        }
      }
    }

    var loading = {};
    loading.show = _show;
    loading.hide = _hide;
    loading.alert = _alert;
    return loading;
  }
})();
