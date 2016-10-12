/**
 * Created by wangll on 2016/6/5.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .config(datePickerConfig);
  angular
    .module('app')
    .config(timePickerConfig);

  function datePickerConfig(ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      setLabel: '确认',
      todayLabel: '今天',
      closeLabel: '取消',
      mondayFirst: true,
      weeksList: ["日", "一", "二", "三", "四", "五", "六"],
      monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      templateType: 'popup',
      from: new Date(2016, 1, 1),
      to: new Date(2018, 12, 31),
      showTodayButton: false,
      dateFormat: 'yyyy-MM-dd',
      closeOnSelect: true
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  }
  function timePickerConfig(ionicTimePickerProvider) {
    var timePickerObj = {
      inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
      format: 24,
      step: 15,
      setLabel: '确认',
      closeLabel: '取消'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
  }

})();
