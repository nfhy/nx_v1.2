/**
 * Created by wangll on 2016/6/5.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('chartShowCtrl', chartShowController);

  function chartShowController($rootScope, myHttp, localData, $state, $ionicLoading) {
    var vm = this;
    vm.userInfo = localData.get('user_info');
    vm.chartSetting = localData.get('chartSetting');
    if (!vm.userInfo || !vm.chartSetting) {
      alert('会话过期，请重新登录...');
      $state.go('login');
      return;
    }
    _loadData();
    //获取历史数据
    //{"msg":"webHistory","data":{"devIndex":100100,"startTime":"2016-01-26 16:20:10","endTime":"",”space”:1,”token”:”zhenglei”}}
    function _loadData() {
      _showLoading();
      var postMsg = {'msg' : 'webHistory',
        'data' : {'devIndex' : parseInt(vm.chartSetting.devIndex), 'startTime' : vm.chartSetting.startTime, 'endTime' : vm.chartSetting.endTime, 'space' : vm.chartSetting.space,
          'token' : vm.userInfo.token, 'userName' : vm.userInfo.userName}};
      var promise = myHttp.post(postMsg);
      if (promise) {
        myHttp.handlePromise(promise, _onSuccess, _onError, _onError);
      }
    }

    function _onSuccess(data) {
      _handleData(data.result);
      $rootScope.pendResolve('generate-chart', undefined, 'success', '', '加载数据成功');
      _hideLoading();
    }

    function _onError(data) {
      $rootScope.pendResolve('generate-chart', undefined, 'error', '', '加载数据失败,'+data);
      _hideLoading();

    }
    //{"msg":"webHistory","data":{"resCode":"0","desc":"操作完成",”cmdToken”:”xxxxx”,"devIndex":100100,
    // "result":[{"average":10.0 , “min”:9.0,”max”:11.0,"time":"2016-01-26 16:20:00"} space = 2 | 3
    //":[{"val":10.0 ,”warn”:0,"time":"2016-01-26 16:20:00"} space = 1
    var _handleData = function(result) {
      if (!result) {
        alert('当前设置下没有设备读数');
      }

      if (vm.chartSetting.space == '1') {
        var date = [];
        var data = [];
        for (var i = 0; i <= result.length-1; i++) {
          data.push(result[i].val);
          date.push(result[i].time);
        }
        vm.option = myoption(date, ['读数'], [myseries('读数',0,data)]);
      }
      else {
        var date = [];
        var dataMax = [];
        var dataMin = [];
        var dataAve = [];
        for (var i = 0; i <= result.length-1; i++) {
          dataMax.push(result[i].max);
          dataMin.push(result[i].min);
          dataAve.push(result[i].average);
          date.push(result[i].time);
        }
        vm.option = myoption(date, ['最大值', '最小值', '平均值'], [myseries('最大值', 0, dataMax), myseries('最小值', 1, dataMin), myseries('平均值', 2, dataAve)]);
      }
    };

    function myoption(date, legend, series) {
      return {
        tooltip: {
          trigger: 'axis'
        },
        title: {
          x: 'center',
          y: 'bottom',
          text: _devTypeName(localData.get('nowDev'))
        },
        legend: {
          x: 'left',
          data: legend
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {show: true}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 10
        }, {
          start: 0,
          end: 10
        }],
        series: series
      };
    }
    function myseries(name,colorIndex, data) {
      var colors = ['rgb(0, 200, 255)', 'rgb(200, 0, 255)', 'rgb(255, 200, 0)'];
      return {
        name:name,
        type:'line',
        smooth:true,
        itemStyle: {
          normal: {
            color: colors[colorIndex]
          }
        },
        data: data
      }
    }
    function _showLoading() {
      $ionicLoading.show({
        template:'<ion-spinner icon="android"></ion-spinner><br/>数据加载中，请稍候'
      });
    }
    function _hideLoading() {
      $ionicLoading.hide();
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
