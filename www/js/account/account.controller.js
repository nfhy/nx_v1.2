/**
 * Created by wangll on 2016/6/6.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('accountCtrl', accountController);

  function accountController($rootScope, $state, localData, myHttp, $timeout, loading, $ionicPopup) {
    var vm = this;
    //获取本机用户信息，如果没有，重新登录
    vm.userInfo = localData.get('user_info');
    if (!$rootScope.localStorageCheck(vm.userInfo)) {
      return;
    }

    vm.logOut = _logOut;
    vm.submitChange = _submit;

    //##################################
    //function
    function _logOut() {
      var confirm = $ionicPopup.confirm(
        {
          title: '确定要退出登录吗', // String. The title of the popup.
          cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
          cancelType: 'button-balanced', // String (default: 'button-default'). The type of the Cancel button.
          okText: '退出登录', // String (default: 'OK'). The text of the OK button.
          okType: 'button-assertive', // String (default: 'button-positive'). The type of the OK button.
        }
      );
      confirm.then(function(res) {
        if(res) {
          var postData = {
            'msg': 'logOut',
            'data': {
              'token': vm.userInfo.token, 'userName': vm.userInfo.userName
            }
          };
          var promise = myHttp.post(postData);
          localData.flush();
          $state.go('fields');
        } else {
        }
      });
    }
    function _submit() {
      loading.show();
      var postData = {
        'msg': 'appUserMgr', 'data': {
          'token': vm.userInfo.token, 'userName': vm.userInfo.userName,
          'detail': {'tel': vm.userInfo.tel, 'recvWarn': vm.userInfo.bRecvWarn, 'userName': vm.userInfo.userName}
        }
      };
      var promise = myHttp.post(postData);
      if (promise) {
        myHttp.handlePromise(promise, _onSuccess, _onError);
      }
      function _onSuccess() {
        localData.set('user_info', vm.userInfo);
        loading.hide('保存成功', 'success');
      }

      function _onError(data) {
        loading.hide('保存失败', 'error');
      }
    }
  }
})();
