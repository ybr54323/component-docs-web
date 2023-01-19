window._UNIFIED_URL = '$UNIFIED_URL';
// 认证中心地址
window._VUE_APP_AUTHORIZE_SERVER_URL = '$VUE_APP_AUTHORIZE_SERVER_URL';
// 应用ID
window._VUE_APP_AUTHORIZATION_CLIENT_ID = '$VUE_APP_AUTHORIZATION_CLIENT_ID';
// 退出登录
window._VUE_APP_REDIRECT_URL_LOGOUT = '$VUE_APP_REDIRECT_URL_LOGOUT';
// 重定向地址
window._VUE_APP_REDIRECT_URL = '$VUE_APP_REDIRECT_URL';
window._DATASHARE_URL = "$DATASHARE_URL";
window._FORM_RENDER_URL="$FORM_RENDER_URL";
// 文件预览服务器地址
//window._VUE_APP_PREVIEW_URL = '$VUE_APP_PREVIEW_URL';

//系统后台服务API，系统后台服务API，用于组装文件源地址等
window._VUE_APP_BASE_URL= '$VUE_APP_BASE_URL';

// 判断是否被覆写成功，兼容开发环境
['_UNIFIED_URL','_VUE_APP_AUTHORIZE_SERVER_URL','_VUE_APP_AUTHORIZATION_CLIENT_ID','_VUE_APP_BASE_URL','_VUE_APP_REDIRECT_URL_LOGOUT','_VUE_APP_REDIRECT_URL'].forEach(function(globalName){
  if(window[globalName].indexOf('$')===0){
    window[globalName] = ''
  }
});
