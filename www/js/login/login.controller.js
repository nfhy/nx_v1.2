/**
 * Created by wangll on 2016/6/4.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('loginCtrl', loginController);


  function loginController($rootScope, $state, localData, myHttp, $ionicLoading, jpushService) {
    $rootScope.topLeftButtonShow = false;
    var vm = this;
    vm.isLogin = false;//是否点击了登录按钮，防止重复提交
    vm.isError = false;
    vm.login = _login;
    //浏览器缓存中记录用户信息，缓存中没有要去sqlLite中获取，还没有就要重新登录
    vm.userInfo = localData.get('user_info');
    if (vm.userInfo && vm.userInfo.token) {
      $state.go('fields');
    }
    //localData.flush();
    //#############################
    //function
    /**
     * 登录成功，关闭modal，加载园地列表；登录失败提示信息
     * @private
     */
    function _login() {
      _showLoading();
      vm.isLogin = true;
      vm.isError = false;
      vm.errorMsg = '';
      var data = {};
      data.userName = vm.userInfo.userName;
      data.passWord = vm.userInfo.passWord;
      //jpushService.registId();
      var promise = myHttp.post({'msg' : 'login', 'data' : data});
      myHttp.handlePromise(promise, onSuccess, onError, onFail);
      //{"resCode":"0","desc":"",”role”:2,”bRecvWarn”:1,”token”:”zhenglei”}}
      function onSuccess(data) {
        var role = data.role;
        var bRecvWarn = data.bRecvWarn;
        var token = data.token;
        var tel = data.tel;
        var enable = '' + data.enable;
        if (enable != '1') {
          alert('该用户已失效，不能登录');
          vm.isLogin = false;
        }
        else {
          vm.userInfo.role = role;
          $rootScope.role = role;
          vm.userInfo.bRecvWarn = bRecvWarn;
          vm.userInfo.token = token;
          vm.userInfo.tel = tel;
          //存入本地缓存
          localData.set('user_info', vm.userInfo);
          localData.set('need_loop', true);
          vm.isLogin = false;
          //_updateJpushId();
          $state.reload();
          $rootScope.closeModal();
        }
        _hideLoading();
      }
    }

    function onFail(data) {
      vm.isLoading = false;
      vm.isError = true;
      vm.errorMsg = data;
      vm.isLogin = false;
      _hideLoading();
    }

    function onError(data) {
      alert('出错了...' + data);
      console.log('err:'+data);
      vm.isLoading = false;
      vm.isError = true;
      vm.errorMsg = '出错了...';
      vm.isLogin = false;
      _hideLoading();
    }

    function _showLoading() {
      $ionicLoading.show({
        template:'<ion-spinner icon="android"></ion-spinner><br/>登录中...'
      });
    }
    function _hideLoading() {
      $ionicLoading.hide();
    }

    function _updateJpushId() {
      var _jpushId = localData.get('jpushId');
      if (_jpushId && _jpushId.length >= 0) {
        var data = {};
        data.jpushId = _jpushId;
        data.userName = vm.userInfo.userName;
        data.token = vm.userInfo.token;
        var promise = myHttp.post({'msg' : 'jpushId', 'data' : data});
        myHttp.handlePromise(promise, function(){});
      }
    }
  }
})();
