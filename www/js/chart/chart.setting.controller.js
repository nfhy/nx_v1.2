/**
 * Created by wangll on 2016/6/5.
 */
(function() {
  angular
    .module('app')
    .controller('chartSettingCtrl', chartSettingController);

  function chartSettingController($rootScope, ionicDatePicker, ionicTimePicker, localData, $state, $stateParams) {
    var vm = this;
    //获取本机用户信息，如果没有，重新登录
    vm.userInfo = localData.get('user_info');
    if (!vm.userInfo) {
      alert('会话过期，请重新登录...');
      $state.go('login');
      return;
    }
    vm.devIndex = $stateParams['devIndex'];
    if ((!vm.devIndex) || isNaN(vm.devIndex)) {
      loading.alert('参数错误，请返回重新选择', 'error');
      return;
    }
    var tp = {
      callback: function (val) {      //Mandatory
        if (typeof (val) === 'undefined') {
        } else {
          var selectedTime = new Date(val * 1000);
          if (vm.type == 's') {
            vm.mytime1 = selectedTime;
            vm.time1Change();
          }
          else {
            vm.mytime2 = selectedTime;
            vm.time2Change();
          }
        }
      }
    };
    vm.openTimePicker = function(type) {
      vm.type = type;
      ionicTimePicker.openTimePicker(tp);
    };
    var dp = {
      callback: function (val) {  //Mandatory
        if (vm.type == 's') {
          vm.dt1 = new Date(val);
          vm.dt1Change();
        }
        else {
          vm.dt2 = new Date(val);
          vm.dt2Change();
        }
      }
    };

    vm.openDatePicker = function(type){
      vm.type = type;
      ionicDatePicker.openDatePicker(dp);
    };

    vm.space = '';
    vm.dt1str = '';
    vm.dt2str = '';
    vm.dt1 = new Date();
    vm.dt2 = new Date();
    vm.mytime1 = new Date();
    vm.mytime2 = new Date();
    vm.settingMsgStr = '';
    vm.spaceMsg = '请先选择数据采样时间间隔';
    vm.generateChart = function() {
      var chartSetting = {
        'devIndex' : vm.devIndex,
        'startTime' : vm.dt1str,
        'endTime' : vm.dt2str,
        'space' : vm.space
      }
      localData.set('chartSetting', chartSetting);
      $state.go('chart-show');
    }

    //数据粒度模式切换
    vm.spaceChange = function() {
      if (vm.space == '1') {
        vm.spaceMsg = '数据采样精确到每分钟，显示每分钟监测数据，选择起始时间即可生成折线图';
      }
      else if (vm.space == '2') {
        vm.spaceMsg = '数据采样精确到小时，显示每小时的最大值、最小值和平均值数据,选择起始时间和截止时间即可生成折线图';
      }
      else if (vm.space == '3') {
        vm.spaceMsg = '数据采样精确到天，显示每天最大值、最小值和平均值数据，选择起始时间和截止时间即可生成折线图';
      }
      vm.settingMsg();
    };
    vm.dt1Change = function () {
      vm.dt1.setHours(vm.mytime1.getUTCHours());
      vm.dt1.setMinutes(vm.mytime1.getUTCMinutes());
      vm.dt1.setSeconds(vm.mytime1.getSeconds());
      vm.dt1str = vm.dt1.Format('yyyy-MM-dd hh:mm:ss');
      vm.settingMsg();
    };
    vm.dt2Change = function () {
      vm.dt2.setHours(vm.mytime2.getUTCHours());
      vm.dt2.setMinutes(vm.mytime2.getUTCMinutes());
      vm.dt2.setSeconds(vm.mytime2.getSeconds());
      vm.dt2str = vm.dt2.Format('yyyy-MM-dd hh:mm:ss');
      vm.settingMsg();
    };
    vm.time1Change = function () {
      if (!vm.dt1) return;
      vm.dt1.setHours(vm.mytime1.getUTCHours());
      vm.dt1.setMinutes(vm.mytime1.getUTCMinutes());
      vm.dt1.setSeconds(vm.mytime1.getSeconds());
      vm.dt1str = vm.dt1.Format('yyyy-MM-dd hh:mm:ss');
      vm.settingMsg();
    };
    vm.time2Change = function () {
      if (!vm.dt2) return;
      vm.dt2.setHours(vm.mytime2.getUTCHours());
      vm.dt2.setMinutes(vm.mytime2.getUTCMinutes());
      vm.dt2.setSeconds(vm.mytime2.getSeconds());
      vm.dt2str = vm.dt2.Format('yyyy-MM-dd hh:mm:ss');
      vm.settingMsg();
    };
    vm.settingMsg = function() {
      var msg = '';
      if (vm.space) {
        if (vm.space == '1') {
          msg = '数据采样精确到分钟，显示设备每分钟读数.';
          if (vm.dt1str) {
            msg += '采样时间开始于' + vm.dt1str;
          }
        }
        else if (vm.space == '2') {
          msg = '数据采样精确到小时，显示设备每小时读数的最大值、最小值和平均值.';
          if (vm.dt1str && vm.dt2str) {
            msg +='采样时间从 ' + vm.dt1str + ' 到 ' + vm.dt2str;
          }
        }
        else if (vm.space == '3') {
          msg = '数据采样精确到天，显示设备每天读数的最大值、最小值和平均值.';
          if (vm.dt1str && vm.dt2str) {
            msg += '采样时间从 ' + vm.dt1str + ' 到 ' + vm.dt2str;
          }
        }
      }
      vm.settingMsgStr = msg;
    }
  }
})();
