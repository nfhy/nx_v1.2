/**
 * Created by wangll on 16/2/26.
 */
(function(){
  'use strict';
  angular.module('app')
    .factory('localData', dataFactory);

  dataFactory.$inject = ['$window'];

  function dataFactory($window) {
    //一般化方法
    function set(key, data) {
      $window.localStorage[key] = JSON.stringify(data);
    }
    function get(key) {
      var val = $window.localStorage[key];
      return val?JSON.parse(val) : {};
    }
    function flush() {
      $window.localStorage.clear();
    }
    function getByCode(key, code) {
      var data = get(key);
      if (data) {
        return data[code];
      }
    }
    //专门化方法
    function getFieldByFieldIndex(fieldIndex) {
      var fields = get('fields');
      if (fields) {
        for (var i = 0; i <= fields.length - 1; i++) {
          var field = fields[i];
          if (parseInt(field.fieldIndex) == parseInt(fieldIndex)) {
            return field;
          }
        }
      }
    }
    function getRawdeviceByDevIndex(devIndex) {
      var rawDevices = get('rawdevices');
      if (rawDevices) {
        for (var i = 0; i <= rawDevices.length - 1; i++) {
          var rawdevice = rawDevices[i];
          if (parseInt(rawdevice.devIndex) == parseInt(devIndex)) {
            return rawdevice;
          }
        }
      }
    }
    function getMyDeviceByDevIndex(channelDevIndex) {
      var mydevices = get('mydevices');
      if (mydevices) {
        for (var i = 0; i <= mydevices.length - 1; i++) {
          var mydevice = mydevices[i];
          if (parseInt(mydevice.channelDevIndex) == parseInt(channelDevIndex)) {
            return mydevice;
          }
        }
      }
    }
    function getAuserByUsername(username) {
      var ausers = get('ausers');
      if (ausers) {
        for (var i = 0; i <= ausers.length - 1; i++) {
          var auser = ausers[i];
          if (auser.userName == username) {
            return auser;
          }
        }
      }
    }
    return {
      set: set,
      get: get,
      flush: flush,
      getByCode: getByCode,
      //专门化方法
      getFieldByFieldIndex : getFieldByFieldIndex,
      getRawdeviceByDevIndex : getRawdeviceByDevIndex,
      getMyDeviceByDevIndex : getMyDeviceByDevIndex,
      getAuserByUsername : getAuserByUsername
    }
  }

})()
