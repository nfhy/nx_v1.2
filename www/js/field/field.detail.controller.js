/**
 * Created by wangll on 2016/6/4.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('fieldDetailCtrl', fieldDetailController);

  function fieldDetailController($rootScope, $scope, $state, $stateParams, localData, myHttp, $ionicLoading, $ionicModal, loading) {
    var vm = this;
    //获取本机用户信息，如果没有，重新登录
    vm.userInfo = localData.get('user_info');
    if (!vm.userInfo) {
      alert('会话过期，请重新登录...');
      $state.go('login');
      return;
    }
    vm.fieldIndex = $stateParams['fieldIndex'];
    if (isNaN(vm.fieldIndex)) {
      loading.alert('参数错误，请返回重新选择', 'error');
      return;
    }
    vm.field = localData.getFieldByFieldIndex(vm.fieldIndex);
    if (!vm.field) {
      loading.alert('参数错误，请返回重新选择', 'error');
      return;
    }
    //加载弹出modal
    $ionicModal.fromTemplateUrl('field-edit.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    vm.showEdit = function(key, type) {
      vm.key = key;
      vm.title = '';
      vm.type = type;
      switch (key) {
        case 'fieldName' : vm.title = '园地名'; vm.aval = vm.field[key]; break;
        case 'fieldDesc' : vm.title = '园地描述'; vm.aval = vm.field[key]; break;
        default : {
          var dev = key;
          var devTypeIndex = dev.devTypeIndex;
          var devTypeTable = localData.get('devTypeTable');
          if (devTypeIndex && devTypeTable) {
            vm.devType = devTypeTable[devTypeIndex];
            if (type == 'max') {
              vm.min = dev.min;
              vm.max = vm.devType.max;
              vm.aval = dev.max;
              vm.title = '标准值最大值';
            }
            else {
              vm.min = vm.devType.min;
              vm.max = dev.max;
              vm.aval = dev.min;
              vm.title = '标准值最小值';
            }
          }
          break;
        }
      }
      $scope.modal.show();
    };
    vm.closeEdit = function() {
      $scope.modal.hide();
    };
    vm.submitEdit = function() {
      switch (vm.key) {
        case 'fieldName' : vm.field[vm.key] = vm.aval;break;
        case 'fieldDesc' : vm.field[vm.key] = vm.aval;break;
        default : {
          var dev = vm.key;
          for (var i = 0; i<=vm.field.devList.length - 1; i++) {
            if (dev.devIndex == vm.field.devList[i].devIndex) {
              vm.field.devList[i][vm.type] = vm.aval;
            }
          }
          break;
        }
      }
      _editSubmit();
    };
    //当我们用完模型时，清除它！
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // 当隐藏模型时执行动作
    $scope.$on('modal.hide', function() {
      // 执行动作
    });
    // 当移动模型时执行动作
    $scope.$on('modal.removed', function() {
      // 执行动作
    });

    vm.devInfo = _devInfo;
    vm.devClass = _devClass;
    vm.devStandardMaxValue = _devStandardMaxValue;
    vm.devStandardMinValue = _devStandardMinValue;
    vm.devParamName = _devParamName;
    vm.devTypeName = _devTypeName;

    vm.chartSetting = _chartSetting;

    //#####################################
    //function

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

    function _devStandardMaxValue(dev) {
      var devParam = '';
      var devTypeIndex = dev.devTypeIndex;
      var devTypeTable = localData.get('devTypeTable');
      if (devTypeIndex && devTypeTable) {
        devParam = devTypeTable[devTypeIndex].paramName;
      }
      var max = dev.max;
      return max + devParam;
    }

    function _devStandardMinValue(dev) {
      var devParam = '';
      var devTypeIndex = dev.devTypeIndex;
      var devTypeTable = localData.get('devTypeTable');
      if (devTypeIndex && devTypeTable) {
        devParam = devTypeTable[devTypeIndex].paramName;
      }
      var min = dev.min;
      return min + devParam;
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

    //{"msg":"webModifyField",
    // ”data”:
    // {"fieldIndex":1,"fieldName":"甲鱼塘1",”fieldDesc”:”区域描述”, ”userName”:”zhenglei”, ”token”:”zhenglei”,
    // "devList":[{"devIndex":10100,”min”:5.5,”max”:8.0 },{"devIndex":10101,”min”:5.5,”max”:8.0 }]}}
    //修改或新增园地
    function _editSubmit() {
      loading.show();
      vm.field.userName = vm.userInfo.userName;
      vm.field.token = vm.userInfo.token;
      var postMsg = {'msg': 'webModifyField', 'data': vm.field};
      var promise = myHttp.post(postMsg);
      if (promise) {
        myHttp.handlePromise(promise, _onSuccess, _onError);
      }
      function _onSuccess() {
        vm.closeEdit();
        loading.hide('保存成功', 'success');
      }

      function _onError(data) {
        loading.hide('保存失败' + data, 'error');
      }
    }
    function _chartSetting(dev) {
      var devIndex = dev.devIndex;
      localData.set('nowDev', dev);
      $state.go('chart-setting', {'devIndex' : devIndex});
    }
  }
})();
