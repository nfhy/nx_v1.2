/**
 * Created by wangll on 2016/6/4.
 */
(function() {
  angular
    .module('app')
    .controller('coreController', coreController);
  coreController.$inject = ['$rootScope', 'promiseTracker', '$ionicModal', '$ionicPopup', '$timeout', '$ionicHistory', '$ionicLoading'];
  function coreController($rootScope, promiseTracker, $ionicModal, $ionicPopup, $timeout, $ionicHistory, $ionicLoading) {
    /*
    //全局promise跟踪器，主要负责控制加载页面的展示和隐藏
    $rootScope.pendingPromises = {};//延时用promise，主要在异步请求中使用
    //开始跟踪延时promise
    $rootScope.pendPromise = function(pendingKey) {
      var promise = $rootScope.promiseTracker.createPromise();
      $rootScope.pendingPromises[pendingKey] = promise;
    }
    //结束跟踪延时promise并弹出提示框
    $rootScope.pendResolve = function(pendingKey,toaster, type, title, text) {
      var promise = $rootScope.pendingPromises[pendingKey];
      if (promise) {
        promise.resolve();
        delete $rootScope.pendingPromises[pendingKey];
        if (toaster) toaster.pop(type, title, text);
      }
    }
    $rootScope.initResolve = function() {
      for (var key in $rootScope.pendingPromises) {
        $rootScope.pendResolve(key, null, null, '', '');
      }
    }
    $rootScope.promiseTracker = promiseTracker();
    $rootScope.$watch($rootScope.promiseTracker.active, function(isActive) {
      if (isActive) {
        $rootScope.loading = true;
        $rootScope.$broadcast('loadingStart');
      }
      else {
        $rootScope.loading = false;
        $rootScope.$broadcast('loadingEnd');
      }
    });
    */

    //当页面检查到会话超时时，调用本方法弹出登录框体
    $rootScope.toLogin = function() {
      $rootScope.initResolve();
      $rootScope.openModal();
    }
    //弹出登录框体
    $ionicModal.fromTemplateUrl('modal-login.html', {
      animation: 'slide-in-up'
    }).then(function(modal) {
      $rootScope.modal = modal
    });
    $rootScope.openModal = function() {
      $rootScope.modal.show();
    };
    $rootScope.closeModal = function() {
      $rootScope.modal.hide();
    };

    //当页面需要弹出警示框时，调用本方法弹出alert
    $rootScope.showAlert = function(_alert) {
      $ionicPopup.alert(_alert);
    }

    //返回按钮
    $rootScope.goBack = function() {
      $ionicHistory.goBack(-1);
    }

  }
})();
