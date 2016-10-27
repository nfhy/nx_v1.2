/**
 * Created by walulu on 2016/3/7.
 */
(function(){
  'use strict';

  angular
    .module('app')
    .service('myHttp', myHttp);

  myHttp.$inject = ['$rootScope', '$http', '$timeout', '$state', 'localData', 'loading'];

  function myHttp($rootScope, $http, $timeout, $state, localData, loading) {
    var myhttp = this;
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    //var url = 'http://localhost:8080/nxkj/input.do';
    var url = 'http://www.sznxkj.cn:8080/nxkj/input.do';
    var httpResCode = {
      '100001' : '系统未知错误',
      '100002' : '用户名已注册',
      '100003' : '登录密码错误',
      '100004' : '无此用户',
      '100005' : '设备不存在',
      '100006' : '设置参数报警标准设备',
      '100007' : '数据格式错误',
      '100008' : '查询失败',
      '100009' : '修改失败',
      '100010' : '正在执行...',
      '100011' : '没有找到此命令',
      '100012' : '用户停用，无法登陆',
      '100013' : '会话超时，请重新登录',
      '100014' : '园地不存在',
      '100015' : '越权操作'
    }
    myhttp.get = _get;
    myhttp.post = _post;
    myhttp.handlePromise = _handlePromise;
    //由于服务器异步处理，页面需要每隔1秒询问服务器是否完成操作，操作完成前，遮罩层一直显示
    //因此需要一个promise保证tracker一直处于激活状态
    //success 执行成功
    //fail 执行失败
    //error 异常
    function _handlePromise(promise, onsuccess, onerror, onfail) {
      if(!promise) return;
      promise
        .success(function(data) {
          var msg = data.msg;
          var innerData = data.data;
          var resCode = ''+innerData.resCode;
          if (resCode == '0') {//得到正常返回数据时
            if (onsuccess)
              onsuccess(innerData);
          }
          else if (resCode == '100010') {//服务器异步处理时
            //轮询消息，循环查询异步处理结果
            var cmdToken = innerData.cmdToken;
            var pollingMsg = {'msg' : 'getResult', 'data' : {'cmdToken' : cmdToken}};
            //由于服务器异步处理，页面需要每隔1秒询问服务器是否完成操作，操作完成前，遮罩层一直显示
            _polling(pollingMsg);
          }
          else if (resCode == '100013') {
            loading.alert("会话超时，请重新登录", 'error');
            localData.flush();
            $rootScope.toLogin();
          }
          else if (resCode == '100015') {
            loading.alert("越权操作，请重新登录", error);
            localData.flush();
            $state.go('login');
          }
          else {//服务端出错了
            var errMsg = httpResCode[resCode];
            if (!errMsg) {
              var reMsg = data.reMsg;
              if (reMsg) {
                errMsg = reMsg;
              }
              else {
                errMsg = '出现未知错误';
              }
            }
            if (onfail) {
              onfail(errMsg);
            }
            else {
              if (onerror){
                onerror(errMsg);
              }
              else {
                loading.alert(errMsg, 'error');
              }
            }
          }

        })
        .error(function(data) {//客户端异常或网络问题
          if (onerror) {
            onerror(data);
          }
          else {
            loading.alert('出错了：' + data, 'error');
          }
        });

      function _polling(pollingMsg) {
        //发送轮询请求，递归调用处理返回数据的方法，如果服务器仍在处理，继续轮询；如果处理结束，调用onsuccess方法
        //防止过快发送请求，每1秒一次
        var promise;
        $timeout(function(){
        }, 1000)
          .then(function(){
            promise = _post(pollingMsg);
            _handlePromise(promise, onsuccess, onerror);
          });
      }
    }

    function _get(tmpUrl) {
      if (tmpUrl.indexOf('?') >= 0) {
        tmpUrl += '&t=' + new Date().getTime();
      }
      return $http.get(tmpUrl);
    }

    function _post(data) {
      var config = {};
      config.t = new Date().getTime();
      data = data || {};
      data.data = data.data || {};
      data.data.isApp = true;
      return $http.post(url, data, config);
    }

    return {
      get : _get,
      post : _post,
      handlePromise : _handlePromise
    };
  }
})();
