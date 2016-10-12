/**
 * Created by wangll on 2016/6/2.
 */
(function() {
  'use strict';
  angular.module('app')
    .config(routerConfig);

  routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      /*
      .state('tab', {
        url: '/tab',
        abstract: true,
        cache: false,
        templateUrl: 'templates/tabs.html',
        controller: 'coreController'
      })*/

      .state('fields', {
        url: '/fields',
        cache: false,
        views: {
          'tab-fields': {
            templateUrl: 'templates/tab-field-list.html',
            controller: 'fieldListCtrl',
            controllerAs: 'fields'
          }
        }
      })
      .state('field-detail', {
        url: '/fields/:fieldIndex',
        cache: false,
        views: {
          'tab-fields': {
            templateUrl: 'templates/tab-field-detail.html',
            controller: 'fieldDetailCtrl',
            controllerAs: 'fieldDetail'
          }
        }
      })
      .state('chart-setting', {
        url: '/chart/:devIndex',
        cache: false,
        views: {
          'tab-fields': {
            templateUrl: 'templates/tab-chart-setting.html',
            controller: 'chartSettingCtrl',
            controllerAs: 'chartSetting'
          }
        }
      })
      .state('chart-show', {
        url: '/chart/show',
        cache: false,
        views: {
          'tab-fields': {
            templateUrl: 'templates/tab-chart-show.html',
            controller: 'chartShowCtrl',
            controllerAs: 'chartShow'
          }
        }
      })
      .state('account', {
        url: '/account',
        cache: false,
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'accountCtrl',
            controllerAs: 'account'
          }
        }
      })

      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/tab-login.html',
        controller: 'loginCtrl',
        controllerAs: 'login'
      });

    $urlRouterProvider.otherwise('/fields');
  }

})();
