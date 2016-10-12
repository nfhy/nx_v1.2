/**
 * Created by wangll on 2016/6/4.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('fieldListCtrl', fieldListController);

  function fieldListController($rootScope, $scope, $state, localData, myHttp, $ionicLoading, $timeout) {
    var vm = this;
    $rootScope.presentTitle = '我的园地';
    //获取本机用户信息，如果没有，重新登录
    vm.userInfo = localData.get('user_info');
    if (!(vm.userInfo && vm.userInfo.token)) {
      /*
      alert('会话过期，请重新登录...');
      $rootScope.initResolve();
      $state.go('login');
      return;*/
      $rootScope.toLogin();
      return;
    }
    vm.fields = [];//园地信息
    vm.loadFields = _loadFields;
    vm.loopLoadData = _loopLoadData;
    vm.devInfo = _devInfo;
    vm.devClass = _devClass;
    vm.devParamName = _devParamName;
    vm.devTypeName = _devTypeName;
    vm.loadFields();
    vm.loopLoadData();
    //#######################
    //function
    //每分钟拉取实时数据
    function _loopLoadData() {
      var needLoop = localData.get('need_loop');
      if (needLoop) {
        $timeout(function () {
          vm.looping = true;
          _loadFields();
        }, 1000 * 50).then(function () {
          _loopLoadData();
        });
      }
    }
    //加载园地信息
    //获取区域列表，修改、删除、增加后都应该调用该方法并通知ngtable重载
    //{"msg":"webField","data":{"fieldIndex":0,”userName”:”zhenglei” ,”token”:”zhenglei”}}
    function _loadFields() {
      if (!vm.looping) {
        _showLoading();
      }
      $rootScope.pendPromise('load-fields');
      var data = {'msg' : 'appFields' ,
        'data' : {'fieldIndex' : 0, 'userName' : vm.userInfo.userName, 'token' : vm.userInfo.token}};
      var promise = myHttp.post(data);
      if(promise) {
        myHttp.handlePromise(promise, _onSuccess, _onError);
      }
      function _onSuccess(data) {
        _handleData(data);
        $rootScope.pendResolve('load-fields',undefined, 'success', '园地列表刷新', '刷新时间:'+new Date().Format('yyyy-MM-dd hh:mm:ss'));
        _promiseResolve();
        _hideLoading();
      }
      function _onError(data) {
        $rootScope.pendResolve('load-fields', undefined, 'error', '园地列表刷新失败', '失败原因：'+data);
        _promiseResolve();
        _hideLoading();
      }
    }

    function _promiseResolve() {
      $rootScope.pendResolve('finish-edit-field',undefined , 'success','', '园地维护成功');
      $rootScope.pendResolve('login-success',undefined , 'success', '', '欢迎回来:'+vm.userInfo.username);
      $scope.$broadcast('scroll.refreshComplete');
    }
    /*
     * {"msg":"webField",
     * "data":{"resCode":"0","desc":"操作完成","fieldIndex":0,”cmdToken”:”xxxxx”,
     * "result":
     * [{"fieldIndex":1,"fieldName":"甲鱼塘1",”fieldDesc”:”区域1描述”,
     * "devList":
     * [{"devIndex":100100,"devName":"设备1","devTpeIndex":4,”min”:5.0,”max”:8.0 ,"val":55, ”warn”:1,"time":"2016-01-14 15:30:30"},
     * {"devIndex":100101, "devName":"设备2","devTypeIndex":4,”min”:5.0,”max”:8.0,"val":55, ”warn”:1,"time":"2016-01-14 15:30:30" }]}
     * ,
     * "devTypeList":
     * [{“devTypeIndex”:1,”devTypeName”:”DO”,”paramName”:”mg/L”,”min”:-40,”max”:100}]
     *
     */
    function _handleData(data) {
      vm.fields = data.result;
      localData.set('fields', vm.fields);
      var devTypeList = data.devTypeList;
      var devTypeTable = {};
      for(var index in devTypeList) {
        var devTypeInfo = devTypeList[index];
        var devTypeIndex = ''+devTypeInfo.devTypeIndex;
        devTypeTable[devTypeIndex] = devTypeInfo;
      }
      localData.set('devTypeTable', devTypeTable);
    }

    function _showLoading() {
      $ionicLoading.show({
        template:'<ion-spinner icon="android"></ion-spinner><br/>数据加载中，请稍候'
      });
    }
    function _hideLoading() {
      $ionicLoading.hide();
    }

    function _devInfo(dev) {
      var devTypeName = 'NA';
      var devParam = '';
      var devTypeIndex = dev.devTypeIndex;
      var devTypeTable = localData.get('devTypeTable');
      if (devTypeIndex && devTypeTable) {
        devTypeName = devTypeTable[devTypeIndex].devTypeName;
        devParam = devTypeTable[devTypeIndex].paramName;
      }
      return devTypeName + ':' + dev.val + devParam;
    }

    function _devClass(dev) {
      var warn = dev.warn;
      return warn == 1? 'text-warn':'text-fine';
    }

    function _devParamName(dev) {
      var devParam = '';
      var devTypeIndex = dev.devTypeIndex;
      var devTypeTable = localData.get('devTypeTable');
      if (devTypeIndex && devTypeTable) {
        devParam = devTypeTable[devTypeIndex].paramName;
      }
      return devParam;
    }

    function _devTypeName(dev) {
      var devTypeName = '';
      var devTypeIndex = dev.devTypeIndex;
      var devTypeTable = localData.get('devTypeTable');
      if (devTypeIndex && devTypeTable) {
        devTypeName = devTypeTable[devTypeIndex].devTypeName;
      }
      return devTypeName;
    }

  }
})();
