/**
 * Created by wangll on 2016/6/6.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('accountCtrl', accountController);

  function accountController($rootScope, $state, localData, myHttp, $timeout, loading) {
    var vm = this;
    //获取本机用户信息，如果没有，重新登录
    vm.userInfo = localData.get('user_info');
    if (!vm.userInfo) {
      loading.alert('会话过期，请重新登录...', 'error');
      $state.go('login');
      return;
    }

    vm.logOut = _logOut;
    vm.submitChange = _submit;

    //##################################
    //function
    function _logOut() {
      localData.flush();
      $state.go('login');
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
        loading.hide('保存成功', 'success');
      }

      function _onError(data) {
        loading.hide('保存失败', 'error');
      }
    }
  }
})();
