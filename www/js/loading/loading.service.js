/**
 * Created by wangll on 2016/10/12.
 */
(function() {
  'use strict';
   angular.module('app')
     .service('loading', loadingService);

  loadingService.$inject = ['$ionicLoading'];

  function loadingService($ionicLoading) {
    var _show = function() {
      $ionicLoading.show({
        template:'<ion-spinner icon="android"></ion-spinner><br/>数据加载中，请稍候'
      });
    }

    var _hide = function() {
      $ionicLoading.hide();
    }

    var loading = {};
    loading.show = _show;
    loading.hide = _hide;
    return loading;
  }
})();
