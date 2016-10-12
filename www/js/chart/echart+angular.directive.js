/**
 * Created by walulu on 2016/4/15.
 */
(function(){
    'use strict';

    angular
        .module('app')
        .directive('myEchart', myEchart);

    function myEchart () {
        function link($scope, $element, $attrs) {
            var mychart = echarts.init($element[0]);
            // 基于准备好的dom，初始化echarts图表
            $attrs.$observe('uiOptions', function () {
                if ($attrs.uiOptions && $attrs.uiOptions.length >= 1) {
                    mychart.setOption(JSON.parse($attrs.uiOptions));
                }
            }, true);
        }

        return {
            restrict: 'A',
            link: link
        };
    }
})();
