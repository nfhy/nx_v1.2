/**
 * Created by wangll on 2016/9/19.
 */
(function() {
    'use strict';

    angular.module('app')
      .service('jpushService', jpushService);

    jpushService.$inject = ['$window', 'localData'];

    function jpushService($window, localData) {
      var jpushServiceFactory={};
      //var jpushapi=$window.plugins.jPushPlugin;

      //启动极光推送
      var _init=function(){
        $window.plugins.jPushPlugin.init();
        $window.plugins.jPushPlugin.setDebugMode(true);
      }

      //停止极光推送
      var _stopPush=function(){
        $window.plugins.jPushPlugin.stopPush();
      }

      //重启极光推送
      var _resumePush=function(){
        $window.plugins.jPushPlugin.resumePush();
      }

      //设置标签和别名
      var _setTagsWithAlias=function(tags,alias){
        $window.plugins.jPushPlugin.setTagsWithAlias(tags,alias);
      }

      //设置标签
      var _setTags=function(tags){
        $window.plugins.jPushPlugin.setTags(tags);
      }

      //设置别名
      var _setAlias=function(alias){
        $window.plugins.jPushPlugin.setAlias(alias);
      }

      var _registId=function(){
        var onGetRegistradionID = function(data) {
          try {
            localData.set('jpushId', data);
            console.log("JPushPlugin:registrationID is " + data);
          } catch(exception) {
            console.log(exception);
          }
        }
        $window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
      }

      var enable = false;
      var _blank = function(){};

      jpushServiceFactory.init=enable?_init:_blank;
      jpushServiceFactory.stopPush=enable?_stopPush:_blank;
      jpushServiceFactory.resumePush=enable?_resumePush:_blank;

      jpushServiceFactory.setTagsWithAlias=enable?_setTagsWithAlias:_blank;
      jpushServiceFactory.setTags=enable?_setTags:_blank;
      jpushServiceFactory.setAlias=enable?_setAlias:_blank;

      jpushServiceFactory.registId=enable?_registId:_blank;

      return jpushServiceFactory;
    }
  }
)();
