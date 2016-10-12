/**
 * Created by wangll on 2016/6/3.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .directive('hideTabs', hideTabs);
  hideTabs.$inject = ['$rootScope'];
  function hideTabs($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        scope.$on('$ionicView.beforeEnter', function() {
          scope.$watch(attributes.hideTabs, function(value){
            $rootScope.hideTabs = value;
          });
        });

        scope.$on('$ionicView.beforeLeave', function() {
          $rootScope.hideTabs = false;
        });
      }
    };
  }
})();
