export function setCookie(name, value, expire) {
  var date = new Date();
  date.setSeconds(date.getSeconds() + expire);
  try {
    document.cookie =
      name +
      "=" +
      escape(value) +
      "; expires=" +
      date.toGMTString() +
      ";path=/";
  } catch (error) {}
}

export function getCookie(name) {
  try {
    if (document.cookie.length > 0) {
      let start = document.cookie.indexOf(name + "=");
      if (start !== -1) {
        start = start + name.length + 1;
        let end = document.cookie.indexOf(";", start);
        if (end === -1) end = document.cookie.length;
        return unescape(document.cookie.substring(start, end));
      }
    }
    return "";
  } catch (error) {}
}

export function getUrlParam(paramName) {
  try {
    var url = document.location.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
      var arrPara = arrObj[1].split("&");
      var arr;

      for (var i = 0; i < arrPara.length; i++) {
        arr = arrPara[i].split("=");

        if (arr != null && arr[0] === paramName) {
          return arr[1];
        }
      }
      return "";
    } else {
      return "";
    }
  } catch (error) {}
}
